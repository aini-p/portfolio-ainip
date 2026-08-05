import { patreonMembershipUrl } from "~/constants/social";

export interface MembershipFeatureItem {
  text: { ja: string; en: string };
}

export interface MembershipTier {
  id: string;
  name: { ja: string; en: string };
  tagline: { ja: string; en: string };
  price: { ja: string; en: string };
  period: { ja: string; en: string };
  popular?: boolean;
  badge?: { ja: string; en: string };
  /** 1280x560相当のTierサムネイル画像 */
  thumbnail: string;
  features: MembershipFeatureItem[];
  patreonTierUrl: string;
}

// メンバーシップLP用のTier定義。価格・特典・Patreon Tier URLは実データに差し替える。
// 各Tierの特典は上位互換（上のTierの特典をすべて含んだ上で追加特典がある）。
export const membershipTiers: MembershipTier[] = [
  {
    id: "trial",
    name: { ja: "🔰お試しさん", en: "🔰 Trial" },
    tagline: {
      ja: "まずは気軽に試してみたい方に",
      en: "For those who want to try it out first",
    },
    price: { ja: "$5", en: "$5" },
    period: { ja: "/ 月", en: "/ month" },
    thumbnail: "/images/placeholder-tier-trial.jpg",
    features: [
      {
        text: {
          ja: "🗝️ 秘密のDiscordチャンネルへご招待！",
          en: "🗝️ An invitation to the secret Discord channel!",
        },
      },
      {
        text: {
          ja: "🔰 約1か月分のエッチな新作イラストが見放題！",
          en: "🔰 Unlimited access to about a month's worth of brand-new illustrations!",
        },
      },
    ],
    patreonTierUrl: patreonMembershipUrl,
  },
  {
    id: "standard",
    name: { ja: "💎常連さん", en: "💎 Standard" },
    tagline: {
      ja: "しっかり楽しみたい定番プラン",
      en: "Our most popular plan for full enjoyment",
    },
    price: { ja: "$15", en: "$15" },
    period: { ja: "/ 月", en: "/ month" },
    popular: true,
    badge: { ja: "一番人気", en: "MOST POPULAR" },
    thumbnail: "/images/placeholder-tier-standard.jpg",
    features: [
      {
        text: {
          ja: "🗝️ 秘密のDiscordチャンネルへご招待！",
          en: "🗝️ An invitation to the secret Discord channel!",
        },
      },
      {
        text: {
          ja: "💎 過去の全てのエッチなイラストがすべて見放題！",
          en: "💎 Unlimited access to every past illustration!",
        },
      },
      {
        text: {
          ja: "📦 イラストのZIP一括ダウンロード！",
          en: "📦 Bulk ZIP download of every illustration!",
        },
      },
      {
        text: {
          ja: "🎁 ショップ全商品がいつでも25%OFF！",
          en: "🎁 25% OFF everything in the shop, always!",
        },
      },
    ],
    patreonTierUrl: patreonMembershipUrl,
  },
  {
    id: "partner",
    name: { ja: "👑パートナーさん", en: "👑 Partner" },
    tagline: {
      ja: "すべてを、思う存分。",
      en: "Everything, without limits.",
    },
    price: { ja: "$100", en: "$100" },
    period: { ja: "/ 月", en: "/ month" },
    thumbnail: "/images/placeholder-tier-partner.jpg",
    features: [
      {
        text: {
          ja: "🗝️ 秘密のDiscordチャンネルへご招待！",
          en: "🗝️ An invitation to the secret Discord channel!",
        },
      },
      {
        text: {
          ja: "💎 過去の全てのエッチなイラストがすべて見放題！",
          en: "💎 Unlimited access to every past illustration!",
        },
      },
      {
        text: {
          ja: "📦 イラストのZIP一括ダウンロード！",
          en: "📦 Bulk ZIP download of every illustration!",
        },
      },
      {
        text: {
          ja: "🎁 ショップ全商品がいつでも25%OFF！",
          en: "🎁 25% OFF everything in the shop, always!",
        },
      },
      {
        text: {
          ja: "🎨 リクエスト対応！ご相談の上、好きなキャラのオーダーイラストを制作！",
          en: "🎨 Custom requests — illustrations made just for you, based on a quick consultation!",
        },
      },
    ],
    patreonTierUrl: patreonMembershipUrl,
  },
];
