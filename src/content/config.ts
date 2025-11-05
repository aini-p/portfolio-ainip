import { z, defineCollection } from "astro:content";

const artworksCollection = defineCollection({
  type: 'content',
  // `image`ヘルパーを使うことで、画像最適化が簡単になります
  schema: ({ image }) => z.object({
    title: z.string(),
    publishDate: z.date(),
    src: image(), // 画像ファイルを直接指定できるように変更
    patreonUrl: z.union([
      z.string().url(),      // 有効なURL
      z.literal("None"),   // "None" という文字列
      z.literal("")        // 空の文字列
    ]),
    patreonEmbedImageUrl: image().optional(),
    relatedImages: z.array(z.string()).optional(),
    // SEO
    description: z.string(),
    characters: z.array(z.string()),
    series: z.string(),
    keywords: z.array(z.string()),
  }),
});

export const collections = {
  'artworks': artworksCollection,
};