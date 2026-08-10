import type { CollectionEntry } from "astro:content";

type Artwork = CollectionEntry<"artworks">;

// 新形式(headerImage)優先、なければポートフォリオ画像の1枚目、それも無ければ旧形式のsrcにフォールバック
export function getHeaderImage(artwork: Artwork) {
  const { headerImage, portfolioImages, src } = artwork.data;
  const image = headerImage ?? portfolioImages?.[0] ?? src;
  if (!image) {
    throw new Error(`artwork "${artwork.slug}" has no header image source`);
  }
  return image;
}

// 新形式のportfolioImages配列、旧形式は単一srcを1要素配列として扱う
export function getPortfolioImages(artwork: Artwork) {
  const { portfolioImages, src } = artwork.data;
  if (portfolioImages && portfolioImages.length > 0) {
    return portfolioImages;
  }
  return src ? [src] : [];
}

export function getSampleImages(artwork: Artwork) {
  return artwork.data.sampleImages ?? [];
}

// main_character(旧形式)優先、なければcharacters配列(新形式)をmain+subとして分解
export function getArtworkCharacters(artwork: Artwork): string[] {
  const { main_character, sub_characters, characters } = artwork.data;
  if (main_character) {
    return [main_character, ...(sub_characters ?? [])];
  }
  return characters ?? [];
}

export function getPrimaryCharacter(artwork: Artwork): string | undefined {
  return artwork.data.main_character ?? artwork.data.characters?.[0];
}

// SNSシェアカード用の画像。patreonEmbedImageUrl（タイトル・ロゴ焼き込み済み）があれば優先し、
// なければheaderImageにフォールバックする
export function getShareImage(artwork: Artwork) {
  return artwork.data.patreonEmbedImageUrl ?? getHeaderImage(artwork);
}

// メンバーシップ向けの実際の投稿枚数（Patreon側のFree+Paidグループ実数）。
// 未設定、または0（Free/Paidグループにタグ付けされた画像がないお知らせ記事など）の場合は、
// ポートフォリオ掲載枚数（ポートフォリオ＋サンプル）にフォールバックする
export function getTotalImageCount(artwork: Artwork) {
  return (
    artwork.data.membershipImageCount ||
    getPortfolioImages(artwork).length + getSampleImages(artwork).length
  );
}

// タイトル文字列にそのまま連結する枚数表記（例: 「タイトル 全300枚」）。
// 見た目上タイトルと同じフォント・1行で表示するため、別要素にせずtitle文字列へ直接連結する
export function formatImageCountLabel(
  count: number,
  lang: "ja" | "en",
): string {
  return lang === "ja" ? ` 全${count}枚` : ` (all ${count} images)`;
}

// 記事下部CTAのリード文。枚数・塗りつぶし無しを前面に押し出した短い訴求文言
export function formatMembershipCtaLead(
  count: number,
  lang: "ja" | "en",
): string {
  return lang === "ja"
    ? `続き全${count}枚を塗りつぶしなしで見るなら`
    : `See all ${count} images, unfiltered —`;
}

// キャラクター別一覧ページ用のmeta description・keywords
export function formatCharacterPageDescription(
  characterName: string,
  lang: "ja" | "en",
): string {
  return lang === "ja"
    ? `${characterName}が登場する二次創作イラストの一覧です。`
    : `A list of fan art illustrations featuring ${characterName}.`;
}

export function formatCharacterPageKeywords(
  characterName: string,
  lang: "ja" | "en",
): string {
  return lang === "ja"
    ? `${characterName}, 二次創作, ファンアート, イラスト`
    : `${characterName}, fan art, illustration`;
}

// シリーズ別一覧ページ用のmeta description・keywords
export function formatSeriesPageDescription(
  seriesName: string,
  lang: "ja" | "en",
): string {
  return lang === "ja"
    ? `${seriesName}を題材にした二次創作イラストの一覧です。`
    : `A list of fan art illustrations based on ${seriesName}.`;
}

export function formatSeriesPageKeywords(
  seriesName: string,
  lang: "ja" | "en",
): string {
  return lang === "ja"
    ? `${seriesName}, 二次創作, ファンアート, イラスト`
    : `${seriesName}, fan art, illustration`;
}
