# プロジェクト概要: AiniP ポートフォリオ

これはアーティスト「AiniP」の個人ポートフォリオサイトです。[Astro](https://astro.build/) フレームワークで構築されており、作品のギャラリーを展示しています。このプロジェクトは多言語対応で設定されており、日本語 (`ja`) がデフォルト言語、英語 (`en`) が第二言語となっています。

ポートフォリオの中核は、Astroの [コンテンツコレクション](https://docs.astro.build/ja/guides/content-collections/) 機能によって管理されています。作品のメタデータ、説明、関連画像は `src/content/artworks/` ディレクトリ内のMDXファイルで定義されています。

---
**注:** 今後のやり取りは、特に指定がない限り日本語で行います。
---

## 主要技術

*   **フレームワーク**: [Astro](httpss://astro.build/)
*   **言語**: TypeScript
*   **コンテンツ管理**: Astro コンテンツコレクション と MDX (`.mdx`)
*   **国際化 (i18n)**: ミドルウェアベースのカスタムルーティング (`/` が日本語、`/en/` が英語)。
*   **リンティング & フォーマット**: Biome と Stylelint を使用してコードの品質と一貫性を維持しています。
*   **画像処理**: Astroの内蔵画像最適化機能と、ライトボックス表示のためのFancyboxを使用しています。

## プロジェクトのビルドと実行

`package.json` には、開発ライフサイクルを管理するための以下のスクリプトが定義されています。

*   **開発サーバーの起動**:
    ```bash
    npm run dev
    ```
    （または `npm start`）

*   **本番環境向けのビルド**:
    ```bash
    npm run build
    ```
    このコマンドは、まず `astro check` を実行して型チェックを行い、その後 `dist/` ディレクトリに静的サイトをビルドします。

*   **本番ビルdのプレビュー**:
    ```bash
    npm run preview
    ```

*   **チェックとリンターの実行**:
    ```bash
    # TypeScriptのチェック（astro check経由）とBiomeリンターを実行
    npm run check

    # CSSとAstroファイルに対してStylelintを実行
    npm run stylelint
    ```

## 開発規約

*   **コンテンツ**: すべての作品は `artworks` という名前のコンテンツコレクションとして管理されます。各作品は `src/content/artworks/` 内に独自のサブディレクトリを持ち、そこには `.mdx` コンテンツファイルと関連画像が含まれます。このコレクションのスキーマは `src/content/config.ts` で定義されています。
*   **国際化 (i18n)**:
    *   言語はURLパスによって決定されます。日本語コンテンツはルート (`/profile` など) から、英語コンテンツは `/en/` パス (`/en/profile` など) から提供されます。
    *   `src/middleware.ts` のミドルウェアがURLから言語を検出し、`Astro.locals.lang` に設定します。
    *   UIの翻訳文字列は `src/i18n/ui.ts` に保存されています。
*   **レイアウト**: 主要なサイト構造は `src/layouts/BaseLayout.astro` で定義されています。このレイアウトは、SEOタグ（言語代替のための `hreflang` を含む）、フォント、グローバルスタイルを処理します。
*   **静的アセット**: `favicon.ico` やソーシャルメディア用画像などの公開アセットは `public/` ディレクトリに配置されています。
