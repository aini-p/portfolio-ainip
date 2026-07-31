export interface AffiliateItem {
  title: { ja: string; en: string };
  imageUrl: string;
  affiliateUrl: string;
}

// FANZA成果報酬型アフィリエイトの掲載枠。実際のバナー画像・提携リンクに差し替えて使用する。
export const fanzaAffiliateItems: AffiliateItem[] = [
  {
    title: {
      ja: "サンプル：おすすめアダルトゲーム",
      en: "Sample: recommended adult game",
    },
    imageUrl: "/images/placeholder-affiliate.svg",
    affiliateUrl: "https://al.dmm.co.jp/",
  },
];
