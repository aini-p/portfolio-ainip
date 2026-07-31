import { defineCollection, z } from "astro:content";

const artworksCollection = defineCollection({
  type: "content",
  // `image`ヘルパーを使うことで、画像最適化が簡単になります
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        publishDate: z.date(),
        // 新形式（1記事=複数画像）: ヘッダーサムネイル＋ポートフォリオ画像群＋サンプル画像群
        headerImage: image().optional(),
        portfolioImages: z.array(image()).optional(),
        // メンバーシップ会員向けサンプル画像群
        sampleImages: z.array(image()).optional(),
        // 旧形式（1記事=1画像）との後方互換。新形式では省略可
        src: image().optional(),
        patreonUrl: z.union([
          z
            .string()
            .url(), // 有効なURL
          z.literal("None"), // "None" という文字列
          z.literal(""), // 空の文字列
        ]),
        patreonEmbedImageUrl: image().optional(),
        relatedImages: z.array(z.string()).optional(),
        // TOPページのカテゴリレール振り分け用（複数所属可）
        category: z.array(z.string()).optional(),
        // SEO
        description: z.string(),
        // 新形式: 登場キャラ全員をキャラID順で列挙。旧形式: main_character/sub_charactersを使用
        characters: z.array(z.string()).optional(),
        main_character: z.string().optional(),
        sub_characters: z.array(z.string()).optional(),
        series: z.string(),
        keywords: z.array(z.string()),
      })
      .refine(
        (data) =>
          Boolean(
            data.headerImage ||
              data.src ||
              (data.portfolioImages && data.portfolioImages.length > 0),
          ),
        { message: "headerImage, src, portfolioImages のいずれかが必要です" },
      ),
});

const doujinshiCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      publishDate: z.date(),
      // FANZA準拠 560x420 (4:3) を想定したパッケージ画像
      packageImage: image(),
      sampleImages: z.array(image()).optional(),
      description: z.string(),
      fanzaUrl: z.string().url().optional(),
      patreonUrl: z.string().url().optional(),
      keywords: z.array(z.string()).optional(),
    }),
});

export const collections = {
  artworks: artworksCollection,
  doujinshi: doujinshiCollection,
};
