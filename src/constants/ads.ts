// 表示する広告ネットワークの切り替え設定。
// FANZAアフィリエイトの審査が下りたら activeAdNetwork を "fanza" に戻すだけで復帰できる
// （バナー自体の設置箇所は AffiliateColumn.astro 側で共通化されているため、ここ1箇所の変更で済む）。
export type AdNetwork = "fanza" | "adsense";

export const activeAdNetwork: AdNetwork = "adsense";

export const adsense = {
  client: "ca-pub-2812218267740921",
  slot: "2831723606",
};
