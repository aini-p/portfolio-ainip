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

// 会員向けに公開される総画像枚数（ポートフォリオ＋サンプル）
export function getTotalImageCount(artwork: Artwork) {
  return getPortfolioImages(artwork).length + getSampleImages(artwork).length;
}
