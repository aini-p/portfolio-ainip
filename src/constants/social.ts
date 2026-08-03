export const discordUrl = "https://discord.gg/haBDgjM2uU";

export const patreonUrl = "https://www.patreon.com/AtGoFun";

// メンバーシップへの直接登録導線（記事詳細ページの主要CTAから使用）
export const patreonMembershipUrl =
  "https://www.patreon.com/AtGoFun/membership";

export const xAccountUrls = [
  "https://x.com/at5fun_01",
  "https://x.com/at5fun_02",
  "https://x.com/at5fun_03",
  "https://x.com/at5fun_04",
  "https://x.com/at5fun_05",
] as const;

export const xAccountNames = {
  ja: ["アダルト", "センシティブ", "メイン（凍結）", "メイン", "サブ"],
  en: ["NSFW", "SEN", "Main（BANNED）", "MAIN", "SUB"],
} as const;

export const profileNames = {
  ja: "あと5分。",
  en: "At5Fun",
} as const;

export const siteCopyrightLabel = `${profileNames.ja}| ${profileNames.en}`;

export const pixivUrl = "https://www.pixiv.net/users/107897501";

export interface ShopLink {
  name: { ja: string; en: string };
  abbr: string;
  color: string;
  /** 未設定の場合は準備中として表示する */
  url?: string;
}

export const doujinShopLinks: ShopLink[] = [
  {
    name: { ja: "FANZA同人", en: "FANZA (Doujin)" },
    abbr: "FANZA",
    color: "#ff3d78",
    url: "https://www.dmm.co.jp/dc/doujin/-/list/=/article=maker/exclude_ai=0/id=219001/",
  },
  {
    name: { ja: "デジケット", en: "Digiket" },
    abbr: "デジケ",
    color: "#2bb673",
    url: "https://www.digiket.com/aia/worklist/_data/ID=CIR0016225/",
  },
  {
    name: { ja: "DLsite", en: "DLsite" },
    abbr: "DL",
    color: "#8a92a3",
  },
];
