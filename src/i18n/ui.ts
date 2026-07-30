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
    "profile.shareButton": "Xでシェア",
    "profile.shareText": "あと5分。のポートフォリオサイトだよ。",
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
    "tool5.pageTitle": "ランダムパック画像つくるちゃん",
    "tool5.pageDescription":
      "複数の画像をランダムに並び替えて、指定の解像度とパディングで一枚に詰め込めるツールです。ブラウザ内でサクッと作成できます。",
    "tool5.lead":
      "複数の画像をアップロードすると、ランダムに配置して指定の出力解像度（最大2K）に詰め込んだ合成画像を生成します。異なる解像度の画像も自動的に最適化されます。",
    "tool5.imagesInput": "配置する画像",
    "tool5.dropHint": "ここへ画像をドラッグ&ドロップ",
    "tool5.chooseButton": "画像を選択",
    "tool5.fileHint": "PNG/JPEGなど複数の画像形式に対応しています。",
    "tool5.imageCount": "選択済み: {count}枚",
    "tool5.removeImage": "削除",
    "tool5.shuffleButton": "ランダム並び替え",
    "tool5.resolutionLabel": "出力解像度",
    "tool5.resolutionHelp": "最大2K（2560x1440）まで指定できます。",
    "tool5.paddingLabel": "パディング（px）",
    "tool5.paddingHelp": "各画像の周りに指定px分の余白を入れます。",
    "tool5.rotationLabel": "レイアウト回転（度）",
    "tool5.rotationHelp":
      "レイアウト全体を回転させます。パッキングを再計算して効率的に配置されます。",
    "tool5.scaleLabel": "画像スケール",
    "tool5.scaleHelp": "各画像のサイズを拡大縮小します。",
    "tool5.generateScale": "スケール: {scale}%",
    "tool5.generate": "合成画像を生成",
    "tool5.download": "PNG をダウンロード",
    "tool5.preview": "プレビュー",
    "tool5.statusIdle": "画像を選んで生成できます。",
    "tool5.statusNeedImages": "2枚以上の画像を選択してください。",
    "tool5.statusWorking": "生成中...",
    "tool5.statusReady": "合成画像を生成しました。ダウンロードできます。",
    "tool5.statusError":
      "生成に失敗しました。画像を確認して再度お試しください。",
    "tool5.noteOptimization":
      "異なる解像度の画像は自動的に最適化され、全体のサイズバランスが取れるように調整されます。",
    "tool5.notePadding": "パディングを増やすと、各画像の間隔が広がります。",
    "tool5.contactLabel": "作者へのお問い合わせはこちら:",
    "tool5.contactLinkText": "プロフィールページ",
    "tool5.shareButton": "X でシェア",
    "tool5.shareText":
      "複数画像をランダムに詰め込める「ランダムパック画像つくるちゃん」",
    "tools.card.packTitle": "ランダムパック画像つくるちゃん",
    "tools.card.packDescription":
      "複数の画像をランダムに並び替えて、指定の解像度とパディングで一枚に詰め込みます。",
    "tool6.pageTitle": "画像PDF連結つくるちゃん",
    "tool6.pageDescription":
      "複数の画像をドロップするだけで、1枚ずつページに配置したPDFをブラウザ内で生成できます。フォルダ丸ごとの読み込みとZIPダウンロードにも対応しています。",
    "tool6.lead":
      "画像ファイルやフォルダをドロップすると、ドロップした順番でPDFに連結します。ファイル名の自動採番やZIP形式でのダウンロードにも対応しています。",
    "tool6.imagesInput": "追加する画像 / フォルダ",
    "tool6.dropHint": "ここへ画像またはフォルダをドラッグ&ドロップ",
    "tool6.chooseButton": "画像ファイルを選択",
    "tool6.chooseFolderButton": "フォルダを選択",
    "tool6.fileHint": "PNG / JPEG など主要な画像形式に対応しています。",
    "tool6.imageCount": "{count}枚の画像",
    "tool6.removeImage": "削除",
    "tool6.clearAll": "すべてクリア",
    "tool6.autoNumberLabel": "ファイル名を自動採番する（001.jpg, 002.jpg …）",
    "tool6.autoNumberHelp": "ZIPダウンロード時のファイル名を連番に変更します。PDFには影響しません。",
    "tool6.stripMetaLabel": "埋め込み画像のメタ情報を削除する",
    "tool6.stripMetaHelp": "有効時は再エンコードしてEXIFなどのメタ情報を除去します。",
    "tool6.convertJpgLabel": "埋め込み画像をJPGに変換する",
    "tool6.convertJpgHelp": "PDFへの埋め込みとZIP出力時にJPG化を適用します。",
    "tool6.jpgQualityLabel": "JPG圧縮品質",
    "tool6.jpgQualityValue": "品質: {quality}",
    "tool6.generate": "PDFを生成",
    "tool6.downloadPdf": "PDFをダウンロード",
    "tool6.downloadZip": "ZIPをダウンロード",
    "tool6.statusIdle": "画像を追加して生成できます。",
    "tool6.statusNeedImages": "画像を1枚以上追加してください。",
    "tool6.statusWorking": "生成中...",
    "tool6.statusReady": "PDFを生成しました。ダウンロードできます。",
    "tool6.statusError": "生成に失敗しました。画像を確認して再度お試しください。",
    "tool6.noteJpeg": "透過PNGは白背景に変換してからPDFに埋め込みます。",
    "tool6.noteOrder": "リスト内をドラッグして画像の順番を変更できます。",
    "tool6.noteZip": "ZIPには元画像がそのまま（または採番後の名前で）格納されます。",
    "tool6.contactLabel": "作者へのお問い合わせはこちら:",
    "tool6.contactLinkText": "プロフィールページ",
    "tool6.shareButton": "X でシェア",
    "tool6.shareText": "画像をまとめてPDFに連結できるブラウザツール「画像PDF連結つくるちゃん」",
    "tools.card.pdfTitle": "画像PDF連結つくるちゃん",
    "tools.card.pdfDescription":
      "複数の画像をまとめて1つのPDFに連結します。フォルダ丸ごとのドロップやZIPダウンロードにも対応しています。",
    "tools.open": "ツールを開く",
  },
  en: {
    "nav.gallery": "Gallery",
    "nav.profile": "Profile",
    "nav.tool": "Tool",
    "profile.fansite": "Membership",
    "profile.shareButton": "Share on X",
    "profile.shareText": "This is At5Fun's portfolio site.",
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
    "tool5.pageTitle": "Random Pack Image Maker Chan",
    "tool5.pageDescription":
      "Randomly arrange and pack multiple images into a single output at your chosen resolution (up to 2K) with custom padding.",
    "tool5.lead":
      "Upload multiple images and they'll be randomly arranged and packed into a composite at your specified output resolution (up to 2K × 1440). Images of different sizes are automatically optimized to maintain visual balance.",
    "tool5.imagesInput": "Images to arrange",
    "tool5.dropHint": "Drag and drop images here",
    "tool5.chooseButton": "Choose images",
    "tool5.fileHint":
      "PNG, JPEG, and other common image formats are supported.",
    "tool5.imageCount": "Selected: {count} image(s)",
    "tool5.removeImage": "Remove",
    "tool5.shuffleButton": "Shuffle randomly",
    "tool5.resolutionLabel": "Output resolution",
    "tool5.resolutionHelp": "You can specify up to 2K (2560×1440).",
    "tool5.paddingLabel": "Padding (px)",
    "tool5.paddingHelp": "Adds a margin around each image.",
    "tool5.rotationLabel": "Layout rotation (degrees)",
    "tool5.rotationHelp":
      "Rotate the entire layout. Packing is recalculated for efficient arrangement.",
    "tool5.scaleLabel": "Image scale",
    "tool5.scaleHelp": "Enlarge or reduce the size of each image.",
    "tool5.generateScale": "Scale: {scale}%",
    "tool5.generate": "Generate composite",
    "tool5.download": "Download PNG",
    "tool5.preview": "Preview",
    "tool5.statusIdle": "Choose images to generate the composite.",
    "tool5.statusNeedImages": "Please select at least 2 images.",
    "tool5.statusWorking": "Generating...",
    "tool5.statusReady": "Composite image is ready to download.",
    "tool5.statusError":
      "Failed to generate the composite. Check your images and try again.",
    "tool5.noteOptimization":
      "Images of different resolutions are automatically optimized so the overall size balance is maintained.",
    "tool5.notePadding":
      "Larger padding values increase the spacing between images.",
    "tool5.contactLabel": "Contact the creator here:",
    "tool5.contactLinkText": "Profile page",
    "tool5.shareButton": "Share on X",
    "tool5.shareText":
      "Random Pack Image Maker Chan — arrange and pack multiple images into a composite",
    "tools.card.packTitle": "Random Pack Image Maker Chan",
    "tools.card.packDescription":
      "Randomly arrange multiple images and pack them into a composite at your chosen resolution with custom padding.",
    "tool6.pageTitle": "Image to PDF Maker Chan",
    "tool6.pageDescription":
      "Drop images or entire folders to generate a multi-page PDF in your browser. ZIP download is also supported.",
    "tool6.lead":
      "Drop image files or folders to concatenate them into a single PDF in the order they were added. Auto-numbering and ZIP download are also available.",
    "tool6.imagesInput": "Images / Folder to add",
    "tool6.dropHint": "Drag and drop images or a folder here",
    "tool6.chooseButton": "Choose image files",
    "tool6.chooseFolderButton": "Choose folder",
    "tool6.fileHint":
      "PNG, JPEG, and other common image formats are supported.",
    "tool6.imageCount": "{count} image(s)",
    "tool6.removeImage": "Remove",
    "tool6.clearAll": "Clear all",
    "tool6.autoNumberLabel": "Auto-number filenames (001.jpg, 002.jpg …)",
    "tool6.autoNumberHelp":
      "Renames files to sequential numbers on ZIP download. Does not affect the PDF.",
    "tool6.stripMetaLabel": "Remove metadata from embedded images",
    "tool6.stripMetaHelp":
      "When enabled, images are re-encoded to remove EXIF and other metadata.",
    "tool6.convertJpgLabel": "Convert embedded images to JPG",
    "tool6.convertJpgHelp":
      "Applies JPG conversion for PDF embedding and ZIP output.",
    "tool6.jpgQualityLabel": "JPG compression quality",
    "tool6.jpgQualityValue": "Quality: {quality}",
    "tool6.generate": "Generate PDF",
    "tool6.downloadPdf": "Download PDF",
    "tool6.downloadZip": "Download ZIP",
    "tool6.statusIdle": "Add images to get started.",
    "tool6.statusNeedImages": "Please add at least one image.",
    "tool6.statusWorking": "Generating...",
    "tool6.statusReady": "PDF is ready to download.",
    "tool6.statusError":
      "Failed to generate. Check your images and try again.",
    "tool6.noteJpeg":
      "Transparent PNGs are composited on a white background before embedding in the PDF.",
    "tool6.noteOrder": "Drag items in the list to reorder pages.",
    "tool6.noteZip":
      "The ZIP contains the original images (optionally renamed with auto-numbering).",
    "tool6.contactLabel": "Contact the creator here:",
    "tool6.contactLinkText": "Profile page",
    "tool6.shareButton": "Share on X",
    "tool6.shareText":
      "Image to PDF Maker Chan — concatenate multiple images into a single PDF in your browser",
    "tools.card.pdfTitle": "Image to PDF Maker Chan",
    "tools.card.pdfDescription":
      "Concatenate multiple images into a single PDF. Supports folder drop and ZIP download.",
    "tools.open": "Open tool",
  },
} as const;
