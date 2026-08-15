// ビルド時に「いいねランキング」の現在値を public/ranking-snapshot.json に焼き込む。
// Cloudflare Workers(D1)側の無料枠上限超過やデプロイ直後の一時停止などでAPIが
// 応答しない場合でも、サイト側はこの静的コピーにフォールバックしてランキングを表示できる。
//
// 取得に失敗しても絶対にビルドを失敗させない: 警告を出すだけで、既存の
// public/ranking-snapshot.json(前回ビルド時点の内容)をそのまま残す。
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "public", "ranking-snapshot.json");
const LIMIT = 50;
const TIMEOUT_MS = 10_000;

// astro/viteはビルド時に.envを自動で読むが、このスクリプトは単体のNodeプロセスなので
// process.env に無ければ .env を簡易パースして補う（無くてもエラーにはしない）
async function loadDotEnvFallback() {
  if (process.env.PUBLIC_API_BASE) return;
  try {
    const text = await readFile(path.join(ROOT, ".env"), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (key && !(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .envが無い場合(本番ビルド環境など)はprocess.envの値をそのまま使う
  }
}

async function main() {
  await loadDotEnvFallback();

  const apiBase = process.env.PUBLIC_API_BASE;
  if (!apiBase) {
    console.warn(
      "[ranking-snapshot] PUBLIC_API_BASE が未設定のため、スナップショットの更新をスキップします。",
    );
    return;
  }

  try {
    const res = await fetch(`${apiBase}/likes/ranking?limit=${LIMIT}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`unexpected status ${res.status}`);

    const data = await res.json();
    const snapshot = {
      generatedAt: new Date().toISOString(),
      ranking: Array.isArray(data.ranking) ? data.ranking : [],
    };

    await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
    console.log(
      `[ranking-snapshot] 更新しました (${snapshot.ranking.length}件, ${snapshot.generatedAt})`,
    );
  } catch (error) {
    // Worker側が死んでいる/応答しない場合はここに来る。ビルドは止めず、
    // 既存のpublic/ranking-snapshot.json(前回成功時点のもの)を残したまま進める
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[ranking-snapshot] 取得に失敗したため、既存のスナップショットを維持します: ${message}`,
    );
  }
}

await main();
