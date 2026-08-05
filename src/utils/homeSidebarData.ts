import { getImage } from "astro:assets";
import { getCollection } from "astro:content";
import { getHeaderImage } from "~/utils/artwork";
import { toPathSafeSlug } from "~/utils/slug";

// トップページと同じ左右サイドバーセット（左: 広告バナー+同人誌いいねランキング、
// 右: いいねランキング+作品別記事一覧）を他の一覧・ハブ系ページにも展開するための共通データ構築。
// HomeStyleSidebars.astro から利用する。

export interface SidebarRankingEntry {
  slug: string;
  title: string;
  thumb: string;
  href: string;
  isNew?: boolean;
}

export interface SidebarSeriesEntry {
  name: string;
  count: number;
  thumb: string;
  href: string;
}

export interface HomeSidebarData {
  // 右サイドバーの「いいねランキング」は投稿記事(イラスト)のみのスコープにする
  artworkRankingIndex: SidebarRankingEntry[];
  doujinshiRankingIndex: SidebarRankingEntry[];
  seriesList: SidebarSeriesEntry[];
  hasMoreSeries: boolean;
}

const NEW_BADGE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const SERIES_LIST_LIMIT = 10;

export async function buildHomeSidebarData(
  lang: "ja" | "en",
): Promise<HomeSidebarData> {
  const now = Date.now();
  function isRecentlyPublished(item: { data: { publishDate: Date } }) {
    return now - item.data.publishDate.valueOf() <= NEW_BADGE_WINDOW_MS;
  }
  function toSlug(fullSlug: string) {
    return fullSlug.replace(`${lang}/`, "");
  }

  const galleryPrefix = lang === "en" ? "/en/gallery" : "/gallery";
  const doujinshiPrefix = lang === "en" ? "/en/doujinshi" : "/doujinshi";
  const seriesPrefix = lang === "en" ? "/en/gallery/series" : "/gallery/series";

  const artworks = await getCollection("artworks", ({ id }) =>
    id.startsWith(`${lang}/`),
  );
  const doujinshiList = await getCollection("doujinshi", ({ id }) =>
    id.startsWith(`${lang}/`),
  );
  const ownDoujinshi = doujinshiList
    .filter((d) => d.data.isOwnWork !== false)
    .sort(
      (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
    );

  const sortedByDate = [...artworks].sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  // いいねランキング解決用。LikeButtonのslug形式（作品=素のslug、同人誌="doujinshi-"接頭辞）に
  // 合わせてスラッグを組み立てる。右サイドバー用（投稿記事のみ）と左サイドバー用（同人誌のみ）を
  // それぞれ独立したインデックスとして構築する
  const artworkRankingIndex: SidebarRankingEntry[] = await Promise.all(
    artworks.map(async (artwork) => {
      const optimized = await getImage({
        src: getHeaderImage(artwork),
        width: 480,
        format: "webp",
      });
      return {
        slug: toSlug(artwork.slug),
        title: artwork.data.title,
        thumb: optimized.src,
        href: `${galleryPrefix}/${toSlug(artwork.slug)}`,
        isNew: isRecentlyPublished(artwork),
      };
    }),
  );

  const doujinshiRankingIndex: SidebarRankingEntry[] = await Promise.all(
    ownDoujinshi.map(async (item) => {
      const optimized = await getImage({
        src: item.data.packageImage,
        width: 480,
        format: "webp",
      });
      return {
        slug: `doujinshi-${toSlug(item.slug)}`,
        title: item.data.title,
        thumb: optimized.src,
        href: `${doujinshiPrefix}/${toSlug(item.slug)}`,
        isNew: isRecentlyPublished(item),
      };
    }),
  );

  // 右サイドバー最下部の「作品別記事一覧」: シリーズごとの件数と最新作をまとめる
  const seriesMap = new Map<
    string,
    { count: number; latest: (typeof sortedByDate)[number] }
  >();
  for (const artwork of sortedByDate) {
    const series = artwork.data.series;
    if (!series) continue;
    const existing = seriesMap.get(series);
    if (existing) {
      existing.count += 1;
    } else {
      seriesMap.set(series, { count: 1, latest: artwork });
    }
  }
  const hasMoreSeries = seriesMap.size > SERIES_LIST_LIMIT;
  const seriesList = await Promise.all(
    [...seriesMap.entries()]
      .map(([name, data]) => ({ name, count: data.count, latest: data.latest }))
      .sort((a, b) => b.count - a.count)
      .slice(0, SERIES_LIST_LIMIT)
      .map(async (series) => {
        const optimized = await getImage({
          src: getHeaderImage(series.latest),
          width: 400,
          format: "webp",
        });
        return {
          name: series.name,
          count: series.count,
          thumb: optimized.src,
          href: `${seriesPrefix}/${encodeURIComponent(toPathSafeSlug(series.name))}`,
        };
      }),
  );

  return { artworkRankingIndex, doujinshiRankingIndex, seriesList, hasMoreSeries };
}
