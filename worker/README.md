# at5fun-api

いいね数・ランキング・コメントを保存する Cloudflare Workers + D1 バックエンド。静的サイト本体（Astro）とは独立してデプロイする。

## 初回セットアップ

```bash
cd worker
npm install
wrangler login
wrangler d1 create at5fun-db
```

`wrangler d1 create` の出力に含まれる `database_id` を `wrangler.toml` の `REPLACE_WITH_D1_DATABASE_ID` に貼り付ける。

```bash
wrangler d1 execute at5fun-db --remote --file=schema.sql
```

## デプロイ

```bash
npm run deploy
```

デプロイ後に表示される `https://at5fun-api.<subdomain>.workers.dev` を、サイト側の `.env` の `PUBLIC_API_BASE` に設定する。

## コメントのボット対策（任意）

[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) を使う場合のみ:

```bash
wrangler secret put TURNSTILE_SECRET
```

未設定の場合はボット検証をスキップして動作する。

## ローカル開発

```bash
npm run dev
```

`http://localhost:8787` で起動する。Astro側の `.env` の `PUBLIC_API_BASE` をこのURLに向ければ、`npm run dev`（サイト側）と併用してローカルで疎通確認できる。
