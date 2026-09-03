// ローカル開発中(`astro dev`)専用の記事削除ロジック。
// `src/pages/api/dev/delete-article.ts` からのみ動的import()で呼び出される想定。
// 呼び出し元がimport.meta.env.DEVでガードしているため、本番ビルドではこのモジュールごと
// バンドルから除去される(=node:fsが本番のCloudflare Worker実行環境に持ち込まれない)。
import type { Dirent } from "node:fs";
import { readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

export type ArticleCollection = "artworks" | "doujinshi";

const COLLECTION_CONFIG: Record<
  ArticleCollection,
  { contentDir: string; imagesDir: string }
> = {
  artworks: {
    contentDir: path.join("src", "content", "artworks"),
    imagesDir: path.join("src", "content", "artworks", "_images"),
  },
  doujinshi: {
    contentDir: path.join("src", "content", "doujinshi"),
    imagesDir: path.join("src", "content", "doujinshi", "_images"),
  },
};

const LANGS = ["ja", "en"] as const;

// 検索対象(=記事本文・コードなど)として読み込むテキスト系拡張子。
// 画像そのもの(jpg/png/webp等)はここに含めず、ディレクトリ単位でスキップする
const TEXT_EXTENSIONS = new Set([
  ".mdx",
  ".md",
  ".astro",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".css",
  ".txt",
]);

const SKIP_DIR_NAMES = new Set(["node_modules", ".astro", "dist", "_images"]);

// mdxのfrontmatter/本文中で `../_images/<hexなど>.<ext>` の形で参照される画像パスを拾う
const IMAGE_REF_PATTERN = /_images\/([\w-]+)\.\w+/g;

export interface DeleteArticleResult {
  deletedArticles: string[];
  deletedImages: string[];
  keptImages: string[];
}

function isSafeSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

function extractReferencedImageBaseNames(content: string): Set<string> {
  const baseNames = new Set<string>();
  for (const match of content.matchAll(IMAGE_REF_PATTERN)) {
    baseNames.add(match[1]);
  }
  return baseNames;
}

async function walkTextFiles(rootDir: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(dir: string) {
    let entries: Dirent[];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIR_NAMES.has(entry.name)) {
          continue;
        }
        await walk(fullPath);
      } else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) {
        results.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return results;
}

export async function deleteArticle(
  collection: ArticleCollection,
  slug: string,
): Promise<DeleteArticleResult> {
  if (!isSafeSlug(slug)) {
    throw new Error(`invalid slug: ${slug}`);
  }

  const root = process.cwd();
  const config = COLLECTION_CONFIG[collection];
  const contentDir = path.join(root, config.contentDir);
  const imagesDir = path.join(root, config.imagesDir);

  // 1) ja/en 両方の記事ファイルのうち、実在するものを読み込んでから削除する。
  //    ja/enは同じ作品を指すペアなので、どちらか片方のページから消しても両方消す。
  //    削除候補の画像は、あくまで「この記事が参照していた画像」に限定する
  //    (画像フォルダ全体を対象にすると、この記事と無関係な既存の孤児画像まで
  //    巻き込んで削除してしまうため)
  const deletedArticles: string[] = [];
  const referencedImageBaseNames = new Set<string>();
  for (const lang of LANGS) {
    const mdxPath = path.join(contentDir, lang, `${slug}.mdx`);
    let content: string;
    try {
      content = await readFile(mdxPath, "utf8");
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        continue;
      }
      throw err;
    }
    for (const baseName of extractReferencedImageBaseNames(content)) {
      referencedImageBaseNames.add(baseName);
    }
    await rm(mdxPath);
    deletedArticles.push(path.relative(root, mdxPath));
  }

  if (deletedArticles.length === 0) {
    throw new Error(`article not found for slug "${slug}"`);
  }

  if (referencedImageBaseNames.size === 0) {
    return { deletedArticles, deletedImages: [], keptImages: [] };
  }

  // 2) 削除した記事が参照していた画像だけを対象に、実ファイルを画像フォルダから探す
  let imageEntries: Dirent[];
  try {
    imageEntries = await readdir(imagesDir, { withFileTypes: true });
  } catch {
    imageEntries = [];
  }
  const candidateImages = imageEntries.filter(
    (entry) =>
      entry.isFile() && referencedImageBaseNames.has(path.parse(entry.name).name),
  );

  if (candidateImages.length === 0) {
    return { deletedArticles, deletedImages: [], keptImages: [] };
  }

  // 3) 削除済みの記事を除く、src/ 配下の全テキストファイルを走査して、
  //    それぞれの画像が他のどこかでまだ参照されているかを確認する
  const searchRoots = [path.join(root, "src"), path.join(root, "public")];
  let haystack = "";
  for (const searchRoot of searchRoots) {
    const files = await walkTextFiles(searchRoot);
    for (const file of files) {
      try {
        haystack += await readFile(file, "utf8");
      } catch {
        // バイナリ判定漏れ等は無視
      }
    }
  }

  const deletedImages: string[] = [];
  const keptImages: string[] = [];
  for (const image of candidateImages) {
    const baseName = path.parse(image.name).name;
    const imagePath = path.join(imagesDir, image.name);
    if (haystack.includes(baseName)) {
      keptImages.push(path.relative(root, imagePath));
      continue;
    }
    await rm(imagePath);
    deletedImages.push(path.relative(root, imagePath));
  }

  return { deletedArticles, deletedImages, keptImages };
}
