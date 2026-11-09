import { statSync } from "node:fs";
import path from "node:path";

// `astro dev`(Windows)で記事を再アップロード(サムネ差し替え等)すると、
// `LocalImageUsedWrongly: ... Received ../_images/xxx.jpg` で記事ページが落ちることがある対策。
//
// 原因: 画像フィールド(image())は、Astroが`.astro/content-assets.mjs`(画像パス→importの対応表)
// で解決している。記事を書き換えると対応表は書き直されるが、Windowsではファイル監視が
// 書き込みを取りこぼすことがあり(Astro本体のコメントにも記載あり)、開発サーバーは古い
// 対応表を使い続ける。新しい画像が対応表に無いため、パス文字列のまま`getImage()`に渡って落ちる。
//
// 対策: リクエストのたびに対応表とデータストアの更新時刻を確認し、変わっていれば
// 該当モジュールを開発サーバーのキャッシュから捨てて読み直させる(開発時のみ)。
const WATCHED_FILES = ["content-assets.mjs", "data-store.json"];
const MODULE_IDS = ["\0astro:asset-imports", "\0astro:data-layer-content"];

function invalidate(server, files) {
  const timestamp = Date.now();
  for (const environment of Object.values(server.environments)) {
    const graphModules = new Set();
    for (const id of MODULE_IDS) {
      const mod = environment.moduleGraph.getModuleById(id);
      if (mod) graphModules.add(mod);
    }
    for (const file of files) {
      for (const mod of environment.moduleGraph.getModulesByFile(file) ?? []) {
        graphModules.add(mod);
      }
    }
    for (const mod of graphModules) {
      environment.moduleGraph.invalidateModule(mod, undefined, timestamp, true);
    }

    const evaluated = environment.runner?.evaluatedModules;
    if (!evaluated) continue;
    const runnerModules = new Set();
    for (const id of MODULE_IDS) {
      const mod = evaluated.getModuleById(id);
      if (mod) runnerModules.add(mod);
    }
    for (const file of files) {
      for (const mod of evaluated.getModulesByFile(file) ?? []) {
        runnerModules.add(mod);
      }
    }
    for (const mod of runnerModules) {
      evaluated.invalidateModule(mod);
    }
  }
}

export function contentAssetRefresh() {
  return {
    name: "content-asset-refresh",
    apply: "serve",
    configureServer(server) {
      const dotAstroDir = path.join(server.config.root, ".astro");
      const files = WATCHED_FILES.map((f) => path.join(dotAstroDir, f));
      const lastMtimes = new Map();

      const readMtimes = () =>
        files.map((f) => {
          try {
            return statSync(f).mtimeMs;
          } catch {
            return 0;
          }
        });
      readMtimes().forEach((m, i) => {
        lastMtimes.set(files[i], m);
      });

      server.middlewares.use((_req, _res, next) => {
        const mtimes = readMtimes();
        const changed = mtimes.some((m, i) => m !== lastMtimes.get(files[i]));
        if (changed) {
          mtimes.forEach((m, i) => {
            lastMtimes.set(files[i], m);
          });
          invalidate(server, files);
        }
        next();
      });
    },
  };
}
