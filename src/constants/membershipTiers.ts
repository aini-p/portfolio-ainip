export interface MembershipTier {
  id: string;
  name: { ja: string; en: string };
  price: string;
  features: { ja: string[]; en: string[] };
  patreonTierUrl: string;
}

// メンバーシップLP用のTier定義。価格・特典・Patreon Tier URLは実データに差し替える。
export const membershipTiers: MembershipTier[] = [
  {
    id: "tier1",
    name: { ja: "サポーター", en: "Supporter" },
    price: "$3 / month",
    features: {
      ja: ["広告非表示", "限定壁紙のダウンロード"],
      en: ["Ad-free browsing", "Exclusive wallpaper downloads"],
    },
    patreonTierUrl: "https://www.patreon.com/at5fun",
  },
  {
    id: "tier2",
    name: { ja: "ファン", en: "Fan" },
    price: "$8 / month",
    features: {
      ja: ["Tier1の全特典", "高解像度イラストの先行公開", "限定Discordロール"],
      en: [
        "Everything in Supporter",
        "Early access to high-res art",
        "Exclusive Discord role",
      ],
    },
    patreonTierUrl: "https://www.patreon.com/at5fun",
  },
  {
    id: "tier3",
    name: { ja: "パトロン", en: "Patron" },
    price: "$20 / month",
    features: {
      ja: [
        "Tier2の全特典",
        "月1回のリクエストイラスト",
        "制作過程のアーカイブ視聴",
      ],
      en: [
        "Everything in Fan",
        "One request illustration per month",
        "Access to process archives",
      ],
    },
    patreonTierUrl: "https://www.patreon.com/at5fun",
  },
];
