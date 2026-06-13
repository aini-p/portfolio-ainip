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
    "tool4.pageTitle": "4分割画像つくるちゃん",
    "tool4.pageDescription":
      "画像を16:9に整えて4分割し、Xの4枚投稿向けに見栄えを調整した画像をブラウザ内で作成します。",
    "tool4.lead":
      "1枚の画像を16:9にトリミングした上で、Xの4枚投稿向けに中央の切れ目をpx単位でカットした4分割画像を生成します。BAN回避モードでは分割画像の上下に事前素材を結合した縦長版も作成できます。",
    "tool4.sourceInput": "元画像",
    "tool4.dropHint": "ここへ画像をドラッグ&ドロップ",
    "tool4.chooseButton": "画像を選択",
    "tool4.fileHint": "PNG/JPEGなど一般的な画像形式に対応しています。",
    "tool4.cropHelp":
      "枠の中をドラッグで移動、四隅のハンドルをドラッグで拡大縮小できます。比率は16:9に固定されます。",
    "tool4.cropPreview": "16:9トリミング範囲（四隅ドラッグ調整）",
    "tool4.cropReset": "中央に戻す",
    "tool4.paddingLabel": "十字カット量（px）",
    "tool4.paddingHelp":
      "指定px分だけ中央の縦横ラインを切り落としてから4分割します。Xの4枚配置時の隙間対策に使えます。",
    "tool4.banModeLabel":
      "BAN回避モード（上下2枚ずつガード画像付き縦長版を生成）",
    "tool4.generate": "4分割を生成",
    "tool4.download": "画像4枚をダウンロード",
    "tool4.previewSplit": "4分割プレビュー",
    "tool4.statusIdle": "画像を選んで生成できます。",
    "tool4.statusNeedImage": "元画像を選択してください。",
    "tool4.statusWorking": "生成中...",
    "tool4.statusReady": "4分割画像を生成しました。",
    "tool4.statusError":
      "生成に失敗しました。画像形式やサイズを確認してください。",
    "tool4.noteCrop": "元画像は中央基準で16:9にトリミングしてから分割します。",
    "tool4.notePadding":
      "十字カット量を増やすほど、分割境界で欠けるピクセルが増えて4枚配置時の切れ目が自然になりやすくなります。",
    "tool4.noteBan":
      "BAN回避モードでは、分割画像の上下に事前用意した16:9素材を結合し、中央だけが見える縦長画像を出力します。",
    "tool4.contactLabel": "作者へのお問い合わせはこちら:",
    "tool4.contactLinkText": "プロフィールページ",
    "tool4.shareButton": "X でシェア",
    "tool4.shareText":
      "16:9の画像を4分割してX投稿向けに整えられる「4分割画像つくるちゃん」",
    "tools.pageTitle": "製作支援ツール一覧",
    "tools.pageDescription":
      "イラスト制作やSNS投稿を支援するWebツールの一覧ページです。ブラウザだけで動作する無料ツールを用途別にまとめています。",
    "tools.heading": "製作支援ツール",
    "tools.lead":
      "イラスト制作を補助するブラウザツールをまとめています。インストール不要でブラウザからすぐ使えます。今後もここに追加していきます。",
    "tools.card.tapTitle": "タップ変化画像つくるちゃん",
    "tools.card.tapDescription":
      "白背景と黒背景で見え方が切り替わる透過 PNG を作成します。",
    "tools.card.fourTitle": "4分割画像つくるちゃん",
    "tools.card.fourDescription":
      "16:9トリミング、パディング補正付き4分割、BAN回避用の縦長合成までまとめて作成します。",
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
    "tool4.pageTitle": "4-Way Split Image Maker Chan",
    "tool4.pageDescription":
      "Crop any image to 16:9, split it into four panels for X multi-image posts, and generate posting-safe tall variants in your browser.",
    "tool4.lead":
      "Load one image, crop it to 16:9, then create four panels with a center cross cut in pixels for cleaner X 4-image layouts. BAN-safe mode can also create tall variants with prepared guards.",
    "tool4.sourceInput": "Source image",
    "tool4.dropHint": "Drag and drop an image here",
    "tool4.chooseButton": "Choose image",
    "tool4.fileHint":
      "PNG, JPEG, and other common image formats are supported.",
    "tool4.cropHelp":
      "Drag inside the frame to move it. Drag any corner handle to resize while keeping a fixed 16:9 ratio.",
    "tool4.cropPreview": "16:9 crop area (corner-drag)",
    "tool4.cropReset": "Recenter",
    "tool4.paddingLabel": "Cross cut amount (px)",
    "tool4.paddingHelp":
      "Cuts the center vertical/horizontal seam by the specified pixels before splitting into four images.",
    "tool4.banModeLabel":
      "BAN-safe mode (create tall outputs with two guards on top and bottom)",
    "tool4.generate": "Generate 4-way split",
    "tool4.download": "Download 4 images",
    "tool4.previewSplit": "Split preview",
    "tool4.statusIdle": "Select an image to generate outputs.",
    "tool4.statusNeedImage": "Please choose a source image.",
    "tool4.statusWorking": "Generating...",
    "tool4.statusReady": "4 split images are ready.",
    "tool4.statusError":
      "Failed to generate outputs. Check the source image and try again.",
    "tool4.noteCrop":
      "The source image is center-cropped to 16:9 before splitting.",
    "tool4.notePadding":
      "Larger cross-cut values remove more pixels around the split seam to make gaps feel less obvious in 4-image layouts.",
    "tool4.noteBan":
      "BAN-safe mode stacks prepared 16:9 guard images above and below each split panel, so the middle area is emphasized in previews.",
    "tool4.contactLabel": "Contact the creator here:",
    "tool4.contactLinkText": "Profile page",
    "tool4.shareButton": "Share on X",
    "tool4.shareText":
      "4-Way Split Image Maker Chan — split a 16:9 image for polished X multi-image posts",
    "tools.pageTitle": "Creator Support Tools",
    "tools.pageDescription":
      "Free browser-based tools that support illustration creation and SNS posting. No installation required — use them right in your browser.",
    "tools.heading": "Creator Support Tools",
    "tools.lead":
      "A collection of free browser tools to assist illustration creation and posting. No installation needed. More tools will be added here.",
    "tools.card.tapTitle": "Tap-Change Image Maker Chan",
    "tools.card.tapDescription":
      "Create a transparent PNG that switches appearance on white and black backgrounds.",
    "tools.card.fourTitle": "4-Way Split Image Maker Chan",
    "tools.card.fourDescription":
      "Create 16:9-cropped four-way split panels with padding compensation and optional BAN-safe tall composites.",
    "tools.open": "Open tool",
  },
} as const;
