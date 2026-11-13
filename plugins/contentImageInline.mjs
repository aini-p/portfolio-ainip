import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { open, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageMetadata } from "astro/assets/utils";

// `astro dev`の起動・記事更新後の初回表示が遅い(数分エラーが出続ける)対策(開発時のみ)。
//
// 原因: コンテンツコレクションの画像(image())は`.astro/content-assets.mjs`で
// 画像1枚=1 import(約5000件)として読み込まれ、Astroは1件ごとに画像ファイル全体(合計約900MB)を
// 読んで縦横サイズを調べる。さらに記事を更新すると対応表が書き直され、同じ処理がやり直しになる。
//
// 対策: 対応表モジュールを変換し、各importを「縦横サイズを埋め込んだ画像オブジェクト」に置き換える。
// 縦横サイズはファイル先頭だけ読んで調べ、パス・サイズ・更新時刻をキーにディスクへキャッシュする。
// 出力はAstro本体(astro:assets:esm)が生成するコードと同じ`createImageAsset(...)`呼び出し。
const IMPORT_RE =
  /^import (__ASTRO_IMAGE_IMPORT_\d+) from "([^"?]+)\?astroContentImageFlag=&importer=([^"]+)";$/gm;
const HEAD_BYTES = 256 * 1024;

async function readMeta(file) {
  const handle = await open(file, "r");
  try {
    const { size } = await handle.stat();
    let length = Math.min(size, HEAD_BYTES);
    for (;;) {
      const buf = Buffer.alloc(length);
      await handle.read(buf, 0, length, 0);
      try {
        return await imageMetadata(buf, file);
      } catch (err) {
        // ヘッダが先頭に収まらない画像(大きなEXIF付きJPEG等)は全体を読む
        if (length >= size) throw err;
        length = size;
      }
    }
  } finally {
    await handle.close();
  }
}

export function contentImageInline() {
  let root;
  let cacheFile;
  let cache = {};
  let dirty = false;
  // 進捗表示用(待機ページと/__dev-statusで使う)
  const status = {
    busy: true,
    phase: "starting",
    done: 0,
    total: 0,
    message: "サーバー起動中",
  };

  const saveCache = () => {
    if (!dirty) return;
    dirty = false;
    try {
      mkdirSync(path.dirname(cacheFile), { recursive: true });
      writeFileSync(cacheFile, JSON.stringify(cache));
    } catch {}
  };

  async function getMeta(file) {
    const s = await stat(file);
    const key = `${s.size}:${s.mtimeMs}`;
    const hit = cache[file];
    if (hit && hit.key === key) return hit.meta;
    const meta = await readMeta(file);
    cache[file] = { key, meta };
    dirty = true;
    return meta;
  }

  let lastPort = 4321;
  let rewarmTimer;
  let warming = false;
  async function warmup(port) {
    lastPort = port;
    if (warming) {
      // 実行中なら終わってからもう一度
      rewarmTimer = setTimeout(() => warmup(port), 1000);
      return;
    }
    warming = true;
    status.busy = true;
    const started = Date.now();
    try {
      for (let i = 0; i < 3; i++) {
        const r = await fetch(`http://localhost:${port}/`, {
          headers: { accept: "text/html", "x-dev-warmup": "1" },
        }).catch(() => null);
        if (r?.ok) break;
        await new Promise((ok) => setTimeout(ok, 1000));
      }
    } finally {
      warming = false;
      Object.assign(status, {
        busy: false,
        phase: "ready",
        message: "準備完了",
      });
      console.log(`[content-image-inline] ready (${Date.now() - started}ms)`);
    }
  }

  return {
    name: "content-image-inline",
    apply: "serve",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
      cacheFile = path.join(
        root,
        "node_modules",
        ".astro",
        "content-image-meta.json",
      );
      try {
        cache = JSON.parse(readFileSync(cacheFile, "utf8"));
      } catch {
        cache = {};
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/__dev-status") {
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "no-store");
          res.end(JSON.stringify(status));
          return;
        }
        const isPage =
          req.method === "GET" &&
          (req.headers.accept ?? "").includes("text/html") &&
          !req.url.startsWith("/@") &&
          !req.url.startsWith("/_image") &&
          req.headers["x-dev-warmup"] === undefined;
        // 準備中にページを開いたらエラーではなく進捗付きの待機ページを返す。
        // 裏で同じページを描画させ、終わったら待機ページが自動で再読み込みする
        if (isPage && status.busy) {
          res.statusCode = 503;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(WAITING_PAGE);
          return;
        }
        next();
      });
      // 起動したらすぐトップページを裏で描画し、準備を前倒しする
      server.httpServer?.once("listening", () => {
        const addr = server.httpServer.address();
        const port = typeof addr === "object" && addr ? addr.port : 4321;
        warmup(port);
      });
      // 記事(.mdx)や画像の更新を検知したら、反映が終わるまで待機ページに切り替える
      const contentDir = path.join(root, "src", "content");
      server.watcher.on("all", (_event, file) => {
        if (!path.resolve(file).startsWith(contentDir)) return;
        Object.assign(status, {
          busy: true,
          phase: "content",
          done: 0,
          total: 0,
          message: "記事の更新を反映中",
        });
        clearTimeout(rewarmTimer);
        rewarmTimer = setTimeout(() => warmup(lastPort), 1500);
      });
    },
    async transform(code, id) {
      const clean = id.split("?")[0].replaceAll("\\", "/");
      if (!clean.endsWith("/.astro/content-assets.mjs")) return;
      if (!code.includes("astroContentImageFlag")) return;

      const started = Date.now();
      const matches = [...code.matchAll(IMPORT_RE)];
      const uniqueFiles = new Map();
      for (const [, , base, importer] of matches) {
        const importerPath = fileURLToPath(
          new URL(
            decodeURIComponent(importer),
            `file:///${root.replaceAll("\\", "/")}/`,
          ),
        );
        const file = path.resolve(path.dirname(importerPath), base);
        uniqueFiles.set(`${base}|${importer}`, file);
      }
      const metas = new Map();
      const files = [...new Set(uniqueFiles.values())];
      Object.assign(status, {
        busy: true,
        phase: "images",
        done: 0,
        total: files.length,
        message: "画像情報を読み込み中",
      });
      // 同時に開くファイル数を抑えつつ並列で読む
      let next = 0;
      const worker = async () => {
        while (next < files.length) {
          const file = files[next++];
          try {
            metas.set(file, await getMeta(file));
          } catch {
            metas.set(file, null);
          }
          status.done++;
        }
      };
      await Promise.all(Array.from({ length: 32 }, worker));
      saveCache();

      let fallback = 0;
      const out = code.replace(IMPORT_RE, (line, name, base, importer) => {
        const file = uniqueFiles.get(`${base}|${importer}`);
        const meta = metas.get(file);
        // 読めなかった画像はAstro本来の処理に任せ、エラーメッセージもAstroに出させる
        if (!meta || file.endsWith(".svg")) {
          fallback++;
          return line;
        }
        const fsPath = file.replaceAll("\\", "/");
        // srcはAstro本体(emitImageMetadata)の開発時の形式に合わせる
        const src = `/@fs/${fsPath.replace(/^\//, "")}?origWidth=${meta.width}&origHeight=${meta.height}&origFormat=${meta.format}`;
        return `const ${name} = __astro_createImageAsset(${JSON.stringify({ src, ...meta })},${JSON.stringify(fsPath)}, true);`;
      });
      Object.assign(status, { phase: "render", message: "ページを準備中" });
      console.log(
        `[content-image-inline] ${matches.length - fallback}/${matches.length} images inlined (${files.length} files) in ${Date.now() - started}ms`,
      );
      return {
        code: `import { createImageAsset as __astro_createImageAsset } from "astro/assets/image-asset";\n${out}`,
        map: null,
      };
    },
  };
}

const WAITING_PAGE = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>準備中…</title>
<style>body{font-family:system-ui,sans-serif;background:#111;color:#eee;display:grid;place-items:center;height:100vh;margin:0}
.box{width:min(420px,90vw)}progress{width:100%;height:14px}small{color:#999}</style></head>
<body><div class="box"><h2>開発サーバーを準備中…</h2><p id="m">起動中</p><progress id="p"></progress>
<p><small id="t"></small></small></p></div><script>
const s=Date.now();async function tick(){try{const r=await fetch("/__dev-status",{cache:"no-store"});const j=await r.json();
document.getElementById("m").textContent=j.message;const p=document.getElementById("p");
if(j.phase==="images"&&j.total){p.max=j.total;p.value=j.done;document.getElementById("m").textContent=j.message+" ("+j.done+"/"+j.total+")"}else{p.removeAttribute("value")}
if(!j.busy){location.reload();return}}catch{}document.getElementById("t").textContent="経過 "+Math.round((Date.now()-s)/1000)+" 秒";setTimeout(tick,500)}tick();
</script></body></html>`;
