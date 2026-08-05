# AiniP ポートフォリオサイト (at5fun.com)

イラストレーター「AiniP」のポートフォリオサイトです。日本語(`/`)と英語(`/en`)の2言語対応。

## 1. 全体の仕組み(アーキテクチャ)

このプロジェクトは、性質の異なる **2つの独立したシステム** でできています。

| | 何をしているか | どこにある | 技術 |
|---|---|---|---|
| ① サイト本体 | ページ表示、作品ギャラリー、ほぼ全部 | リポジトリ直下(`src/`など) | Astro(静的サイト) |
| ② いいね機能のバックエンド | 「いいね」の数だけを覚えておくAPI | `worker/` フォルダ | Cloudflare Workers + D1(データベース) |

なぜ分かれているか: ①のAstroサイトはビルドするとただのHTML/CSS/JSファイルになる「静的サイト」で、サーバー側の処理やデータベースを持てません。一方「いいね数を記憶しておく」機能だけはどうしてもデータの保存が必要なので、そこだけ別の小さなサーバー(Cloudflare Workers)とデータベース(D1)を用意しています。

### つながり方

```
ユーザーのブラウザ
   │
   ├─ 通常のページ閲覧 ──────────────▶ ① 静的サイト (at5fun.com)
   │                                      Astroでビルドした、ただのファイル
   │
   └─ 「いいね」ボタンを押したとき ──▶ ② Cloudflare Worker (at5fun-api.xxx.workers.dev)
                                          │
                                          ▼
                                     D1データベース (likes / like_votes テーブル)
```

①のサイトは、`.env` の `PUBLIC_API_BASE` という設定値に「②のAPIがどこにあるか(URL)」を書いておくことで、いいねボタンを押したときにそこへ通信します(実装は [src/components/LikeButton.astro](src/components/LikeButton.astro))。

### 「本番」と「ローカル(開発用)」の違い

② のWorker/D1には、常に **2つの版** が存在します。ここが混乱しやすいポイントです。

- **本番 (`--remote`)**: Cloudflareのサーバー上にある本物のデータベース。実際に at5fun.com を見ている人の「いいね」がここに記録されます。ここを変更すると、公開中のサイトのデータが実際に変わります(取り消せません)。
- **ローカル開発用 (`--local`、コマンドを省略した場合のデフォルト)**: 自分のPCの中だけに一時的に作られる「偽物」のデータベースです(実体は `worker/.wrangler/` フォルダの中のファイル)。`cd worker && npm run dev` を実行すると自動的に作られます。本番とは完全に別物なので、いくら壊しても消しても公開中のサイトには一切影響しません。

→ 「試したいだけ・失敗しても困らない」ときはローカル、「今公開しているサイトのデータを実際に変えたい」ときだけ本番、という使い分けです。

## 2. ディレクトリ構成

```
/
├── src/
│   ├── content/artworks/, doujinshi/   … 作品記事(MDX)と画像
│   ├── content/config.ts               … 記事のスキーマ定義
│   ├── pages/, pages/en/               … 日本語/英語のページ
│   └── components/, layouts/, i18n/    … 部品・レイアウト・多言語文言
├── public/                              … アイコンなど静的ファイル
├── worker/                               … ②のいいね機能バックエンド(別プロジェクト扱い)
│   ├── src/index.ts                     … APIの中身
│   ├── schema.sql                       … データベースの構造(テーブル定義)
│   └── wrangler.toml                    … Cloudflareへの接続設定
├── cleanup.ps1 / cleanup.bat             … 記事・画像・いいねデータの一括削除ツール
├── setup-worker.ps1 / setup-worker.bat   … D1(staging/production)の存在チェック・作成・スキーマ適用・ローカルAPI起動
└── deploy.bat / start.bat                … サイト本体のビルド/起動ショートカット
```

## 3. 開発環境のセットアップ

初回のみ:

```bash
npm install
cd worker && npm install
cd ..
```

## 4. 動作確認(テスト)方法

### サイトの見た目だけ確認したいとき

```bash
npm run dev
```

→ `http://localhost:4321` が開きます。②のAPIには繋がっていないため、いいね数は常に "0" と表示されますが、見た目やページ遷移はこれで確認できます。

### いいね機能まで含めて確認したいとき(2つのターミナルを使う)

**ターミナル1**(②のWorkerをローカルで起動):

```bash
cd worker
npm run dev
```

→ `http://localhost:8787` にローカル版のAPIが起動します。この時、ローカル開発用のD1データベースも自動的に作られます(本番とは無関係、安全にいじれます)。

**ターミナル2**(サイト側をこのローカルAPIに向ける):

リポジトリ直下に `.env` ファイルを作り(`.env.example` を参考に)、以下を設定します。

```
PUBLIC_API_BASE=http://localhost:8787
```

その後:

```bash
npm run dev
```

→ これでいいねボタンを押すと、ローカルのWorker・ローカルのD1に保存されます。本番のデータには一切触れません。

### コードの品質チェック

```bash
npm run check       # 型チェック(astro check) + Biomeによるコードチェック
npm run stylelint    # CSS/Astroのスタイルチェック
npm run build        # 本番と同じ手順でビルドが通るか確認
```

## 5. デプロイ方法

### ① サイト本体(Astro)

```bash
npm run build
```

(または `deploy.bat` をダブルクリック)

→ `dist/` フォルダに静的ファイル一式が生成されます。この中身を、実際に使っているホスティング先へアップロードしてください。**このリポジトリには自動デプロイの仕組み(CIなど)は入っていないため、アップロードは手動で行う必要があります。**

### ② いいね機能のバックエンド(Worker + D1)

`worker/wrangler.toml` は `staging` / `production` の2環境を持っている(それぞれ別のWorker・別のD1データベース)。コマンドには必ず `--config wrangler.toml` を付けること(リポジトリのルートにサイト側の `wrangler.jsonc` があるため、これを付けないと `worker/` 内で実行しても誤ってルートの設定を読み込んでしまう)。

**初回セットアップ(staging・production の存在チェック→なければ作成→スキーマ適用→ローカルサーバー起動まで一括):**

```bash
npx wrangler login   # 初回のみ。Cloudflareアカウントでログイン(ブラウザが開きます)
setup-worker.bat
```

(または [setup-worker.ps1](setup-worker.ps1) をダブルクリック相当で実行)。すでに存在するデータベースはスキップされ、`database_id` が未設定/古い場合のみ [worker/wrangler.toml](worker/wrangler.toml) に書き込まれるので、何度実行しても安全(冪等)。オプション:

```bash
setup-worker.bat -Only staging      # stagingだけ対象にする
setup-worker.bat -Only production   # productionだけ対象にする
setup-worker.bat -SkipDev           # DB確認/作成/スキーマ適用だけ行い、ローカルサーバーは起動しない
```

最後に `http://localhost:8787` でローカル用のAPIサーバーが起動する(Ctrl+Cで停止)。これはWranglerのローカルD1エミュレーションを使うので、実際のstaging/production側のデータには一切触れない。

手動で個別のコマンドを打ちたい場合は次の通り(`setup-worker.bat` が内部で実行しているのと同じ内容):

```bash
cd worker
npx wrangler d1 create at5fun-db-staging                        # 検証用データベースを作成(既に存在する場合は `d1 info` で確認)
npx wrangler d1 create at5fun-db                                # 本番用データベースを作成
```

表示された `database_id` を、それぞれ [worker/wrangler.toml](worker/wrangler.toml) の `REPLACE_WITH_STAGING_D1_DATABASE_ID` / `REPLACE_WITH_PRODUCTION_D1_DATABASE_ID` に書き込む。

```bash
npx wrangler d1 execute at5fun-db-staging --config wrangler.toml --env staging --remote --yes --file=schema.sql
npx wrangler d1 execute at5fun-db --config wrangler.toml --env production --remote --yes --file=schema.sql
```

→ それぞれのデータベースにテーブル(`likes`, `like_votes`)を作成する。`CREATE TABLE IF NOT EXISTS` なので何度実行しても安全。

**コードを更新した後、staging/本番に反映するとき:**

```bash
cd worker
npm run deploy:staging     # at5fun-api-staging を更新
npm run deploy:production  # at5fun-api を更新(即座に公開サイトへ反映され、取り消せない)
```

デプロイ後に表示されるURL(`https://at5fun-api-staging.xxxx.workers.dev` / `https://at5fun-api.xxxx.workers.dev`)を、それぞれ対応するCloudflare側プロジェクト(`at5fun-staging` / `at5fun`)のビルド環境変数 `PUBLIC_API_BASE` に設定する。ローカル(develop)用の `.env` はそのまま `http://localhost:8787`(`cd worker && npm run dev`)を指しておけばよい。

## 6. メンテナンス: 記事の一括削除ツール

[cleanup.ps1](cleanup.ps1) / [cleanup.bat](cleanup.bat) を使うと、記事(MDX)・使われなくなった画像・対応する「いいね」データをまとめて削除できます。

```bash
cleanup.bat                    # プレビューのみ。何も変更されません
cleanup.bat -Force              # 実際に削除。DB側はローカル開発用のみ更新(安全)
cleanup.bat -Force -Remote       # 実際に削除。DB側は本番も更新(取り消せないので要注意)
cleanup.bat -Force -SkipDb       # ファイルだけ削除し、DB側は何も変更しない
cleanup.bat -ImagesOnly -Force   # 記事は一切消さず、どこからも参照されていない画像だけ削除する
```

`-Remote` を付けない限り、本番の「いいね」データには一切触れません。`-ImagesOnly` を付けた場合は記事を1つも削除しないので、DBの更新自体が発生しません(いいねデータが指す記事が消えていないため)。

## 7. 環境変数

`.env`(gitには含まれません。`.env.example` を元に自分で作成します):

```
PUBLIC_API_BASE=https://at5fun-api.YOUR-SUBDOMAIN.workers.dev
```

普段は②の本番URLを設定しておき、上記「動作確認」でローカルのWorkerを試すときだけ一時的に `http://localhost:8787` に書き換えます。
