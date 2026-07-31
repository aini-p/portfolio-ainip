import type { CollectionEntry } from "astro:content";

export interface CategoryDef {
  id: string;
  label: { ja: string; en: string };
  match: (artwork: CollectionEntry<"artworks">) => boolean;
}

// TOPページに「最新の投稿」に続けて表示するカテゴリレール。
// 各作品のフロントマター `category: ["popular"]` 等のタグとここでの id を対応させる。
// レールを増やしたい場合はこの配列に追記するだけでよい。
export const categories: CategoryDef[] = [
  {
    id: "popular",
    label: { ja: "人気シリーズ", en: "Popular series" },
    match: (artwork) => artwork.data.category?.includes("popular") ?? false,
  },
  {
    id: "original",
    label: { ja: "オリジナル作品", en: "Original works" },
    match: (artwork) => artwork.data.category?.includes("original") ?? false,
  },
  {
    id: "fanart",
    label: { ja: "版権イラスト", en: "Fan art" },
    match: (artwork) => artwork.data.category?.includes("fanart") ?? false,
  },
];
