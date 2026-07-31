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
