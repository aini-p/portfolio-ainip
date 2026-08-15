// 表示する広告ネットワークの切り替え設定。
//
// 方針:
// - 日本語ページ(ja) = 国内向け → FANZA/DMMアフィリエイトウィジェット
// - 英語ページ(en)   = 海外向け → 海外の高単価アダルト広告ネットワーク(ExoClick)
//
// Google AdSenseは成人向け表現を含むページでの掲出がポリシー違反となり、
// アカウント停止（他ページの収益も含めて失うリスク）があるため既定では無効化している。
// SFWなページ限定で使いたい場合のみ、呼び出し側で個別に "adsense" を指定すること。
export type AdNetwork = "fanza" | "exoclick" | "adsense" | "none";

export const adNetworkByLang: Record<"ja" | "en", AdNetwork> = {
  ja: "fanza",
  en: "exoclick",
};

// lang(表示言語=閲覧地域の簡易プロキシ)から、そのページで使う広告ネットワークを決定する。
export function resolveAdNetwork(lang: "ja" | "en"): AdNetwork {
  return adNetworkByLang[lang];
}

export const adsense = {
  client: "ca-pub-2812218267740921",
  slot: "2831723606",
};

// ExoClick (https://exoclick.com/) のゾーンID。
// アダルト対応・グローバル対応(特に米国トラフィックの単価が高い)の広告ネットワーク。
// 1. https://exoclick.com/ でパブリッシャー登録し、サイト審査を通す
// 2. 管理画面でバナー広告ゾーンを発行し、発行されたゾーンIDを下記に貼り替える
// 3. 貼り替えるだけで OverseasAdBanner / MobileStickyAd / NativeAdSlot 全箇所に反映される
export const exoclick = {
  zoneId: "TODO_REPLACE_WITH_YOUR_EXOCLICK_ZONE_ID",
};
