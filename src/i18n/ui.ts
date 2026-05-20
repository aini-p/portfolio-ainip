export const languages = {
  ja: "日本語",
  en: "English",
};

export const defaultLang = "ja";

export const ui = {
  ja: {
    "nav.gallery": "ギャラリー",
    "nav.profile": "プロフィール",
    "nav.tool": "ツール",
    "profile.fansite": "メンバーシップ",
    "artwork.related": "関連イラスト",
    "tool.pageTitle": "タップ変化画像つくるちゃん",
    "tool.pageDescription":
      "白背景ではイラスト A、黒背景ではイラスト B に見える PNG をブラウザ内で作成します。",
    "tool.lead":
      "白背景で見せたいイラスト A と、黒背景で見せたいイラスト B を読み込むと、背景色によって見え方が切り替わる透過 PNG を生成できます。",
    "tool.whiteInput": "白背景で見せたいイラスト A",
    "tool.blackInput": "黒背景で見せたいイラスト B",
    "tool.dropHint": "ここへ画像をドラッグ&ドロップ",
    "tool.chooseButton": "画像を選択",
    "tool.fileHint":
      "PNG 推奨です。JPEG は圧縮ノイズで輪郭が崩れやすく、透明情報も保持できないためです。",
    "tool.resizeX": "X 投稿用に 900 x 900px 以下へ縮小する",
    "tool.generate": "合成する",
    "tool.download": "PNG をダウンロード",
    "tool.previewWhite": "白背景プレビュー",
    "tool.previewBlack": "黒背景プレビュー",
    "tool.statusIdle": "2 枚の画像を選ぶと合成できます。",
    "tool.statusNeedBoth": "イラスト A とイラスト B の両方を選択してください。",
    "tool.statusWorking": "合成中...",
    "tool.statusReady": "合成画像を生成しました。ダウンロードできます。",
    "tool.statusError":
      "画像の読み込みに失敗しました。PNG または一般的な画像形式を試してください。",
    "tool.contactLabel": "作者へのお問い合わせはこちら:",
    "tool.contactLinkText": "プロフィールページ",
    "tool.noteApproximation":
      "色の組み合わせによっては、PNG の透明度だけでは完全一致せず近似結果になることがあります。",
    "tool.noteResize":
      "画像サイズが異なる場合は、イラスト A のサイズに合わせてイラスト B をリサイズして合成します。",
    "tool.shareButton": "X でシェア",
    "tool.shareText":
      "見え方が切り替わる透過 PNG を作れるブラウザツール「タップ変化画像つくるちゃん」",
    "tools.pageTitle": "製作支援ツール一覧",
    "tools.pageDescription":
      "イラスト制作やSNS投稿を支援するWebツールの一覧ページです。ブラウザだけで動作する無料ツールを用途別にまとめています。",
    "tools.heading": "製作支援ツール",
    "tools.lead":
      "イラスト制作を補助するブラウザツールをまとめています。インストール不要でブラウザからすぐ使えます。今後もここに追加していきます。",
    "tools.card.tapTitle": "タップ変化画像つくるちゃん",
    "tools.card.tapDescription":
      "白背景と黒背景で見え方が切り替わる透過 PNG を作成します。",
    "tools.open": "ツールを開く",
  },
  en: {
    "nav.gallery": "Gallery",
    "nav.profile": "Profile",
    "nav.tool": "Tool",
    "profile.fansite": "Membership",
    "artwork.related": "Related Artworks",
    "tool.pageTitle": "Tap-Change Image Maker Chan",
    "tool.pageDescription":
      "Create a PNG that shows illustration A on white backgrounds and illustration B on black backgrounds directly in the browser.",
    "tool.lead":
      "Load the illustration you want on white and the illustration you want on black to generate a transparent PNG whose appearance changes with the page background.",
    "tool.whiteInput": "Illustration A for white backgrounds",
    "tool.blackInput": "Illustration B for black backgrounds",
    "tool.dropHint": "Drag and drop an image here",
    "tool.chooseButton": "Choose image",
    "tool.fileHint":
      "PNG is recommended because JPEG compression artifacts can break clean edges, and JPEG does not preserve transparency.",
    "tool.resizeX": "Resize to 900 x 900px or smaller for X posts",
    "tool.generate": "Generate",
    "tool.download": "Download PNG",
    "tool.previewWhite": "Preview on white",
    "tool.previewBlack": "Preview on black",
    "tool.statusIdle": "Choose both images to generate the composite.",
    "tool.statusNeedBoth": "Select both illustration A and illustration B.",
    "tool.statusWorking": "Generating...",
    "tool.statusReady": "Composite image is ready to download.",
    "tool.statusError":
      "Failed to load one of the images. Try PNG or another common image format.",
    "tool.contactLabel": "Contact the creator here:",
    "tool.contactLinkText": "Profile page",
    "tool.noteApproximation":
      "Some color combinations cannot be reproduced perfectly with PNG transparency alone, so the result may be an approximation.",
    "tool.noteResize":
      "If the image sizes differ, illustration B is resized to match illustration A before compositing.",
    "tool.shareButton": "Share on X",
    "tool.shareText":
      "Tap-Change Image Maker Chan — create a transparent PNG that switches appearance",
    "tools.pageTitle": "Creator Support Tools",
    "tools.pageDescription":
      "Free browser-based tools that support illustration creation and SNS posting. No installation required — use them right in your browser.",
    "tools.heading": "Creator Support Tools",
    "tools.lead":
      "A collection of free browser tools to assist illustration creation and posting. No installation needed. More tools will be added here.",
    "tools.card.tapTitle": "Tap-Change Image Maker Chan",
    "tools.card.tapDescription":
      "Create a transparent PNG that switches appearance on white and black backgrounds.",
    "tools.open": "Open tool",
  },
} as const;
