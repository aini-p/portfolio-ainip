# at5fun-api

いいね数・ランキング・コメントを保存する Cloudflare Workers + D1 バックエンド。静的サイト本体（Astro）とは独立してデプロイする。

`wrangler.toml` は `staging` / `production` の2環境を持ち、それぞれ別のWorker（`at5fun-api-staging` / `at5fun-api`）・別のD1データベース（`at5fun-db-staging` / `at5fun-db`）を使う。

**注意**: リポジトリのルートにサイト側の `wrangler.jsonc` があるため、`worker/` ディレクトリ内で `wrangler` コマンドを直接叩くと、そちらを誤って読み込んでしまうことがある。`npm run dev` / `npm run deploy:staging` / `npm run deploy:production` を使うか、直接コマンドを打つ場合は必ず `--config wrangler.toml` を付けること。

## 初回セットアップ（staging・production それぞれ1回ずつ）

```bash
cd worker
npm install
npx wrangler login
npx wrangler d1 create at5fun-db-staging
npx wrangler d1 create at5fun-db
```

出力に含まれる `database_id` を、それぞれ `wrangler.toml` の `REPLACE_WITH_STAGING_D1_DATABASE_ID` / `REPLACE_WITH_PRODUCTION_D1_DATABASE_ID` に貼り付ける。

```bash
npx wrangler d1 execute at5fun-db-staging --config wrangler.toml --env staging --remote --file=schema.sql
npx wrangler d1 execute at5fun-db --config wrangler.toml --env production --remote --file=schema.sql
```

## デプロイ

```bash
npm run deploy:staging
npm run deploy:production
```

デプロイ後に表示される `https://at5fun-api-staging.<subdomain>.workers.dev` / `https://at5fun-api.<subdomain>.workers.dev` を、それぞれ対応するCloudflare側プロジェクト（`at5fun-staging` / `at5fun`）のビルド環境変数 `PUBLIC_API_BASE` に設定する。

## コメントのボット対策（任意）

[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) を使う場合のみ:

```bash
npx wrangler secret put TURNSTILE_SECRET --config wrangler.toml --env staging
npx wrangler secret put TURNSTILE_SECRET --config wrangler.toml --env production
```

未設定の場合はボット検証をスキップして動作する。

## ローカル開発

```bash
npm run dev
```

`http://localhost:8787` で起動する（ローカルはWranglerのD1エミュレーションで動くため、`database_id` がプレースホルダーのままでも問題ない）。Astro側の `.env` の `PUBLIC_API_BASE` をこのURLに向ければ、サイト側の `npm run dev` と併用してローカルで疎通確認できる。
