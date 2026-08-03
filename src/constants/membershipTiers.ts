import { patreonMembershipUrl } from "~/constants/social";

export interface MembershipFeatureItem {
  text: { ja: string; en: string };
  included: boolean;
}

export interface MembershipTier {
  id: string;
  name: { ja: string; en: string };
  tagline: { ja: string; en: string };
  price: { ja: string; en: string };
  period: { ja: string; en: string };
  popular?: boolean;
  badge?: { ja: string; en: string };
  /** true の場合、features の各テキストが既に絵文字始まりなので check/cross アイコンを重ねて表示しない */
  customIcons?: boolean;
  features: MembershipFeatureItem[];
  patreonTierUrl: string;
}

// メンバーシップLP用のTier定義。価格・特典・Patreon Tier URLは実データに差し替える。
export const membershipTiers: MembershipTier[] = [
  {
    id: "tier1",
    name: { ja: "ライト", en: "Light" },
    tagline: {
      ja: "まずは気軽に応援したい方に",
      en: "For casual supporters just getting started",
    },
    price: { ja: "500円", en: "¥500" },
    period: { ja: "/ 月", en: "/ month" },
    features: [
      {
        text: { ja: "最新イラストの先行公開", en: "Early access to new illustrations" },
        included: true,
      },
      {
        text: { ja: "限定Discordチャンネル（一部）", en: "Access to select Discord channels" },
        included: true,
      },
      {
        text: { ja: "過去作品の見放題", en: "Unlimited access to the back catalog" },
        included: false,
      },
      {
        text: { ja: "ショップ割引・リクエスト権", en: "Shop discount & request privileges" },
        included: false,
      },
    ],
    patreonTierUrl: patreonMembershipUrl,
  },
  {
    id: "tier2",
    name: { ja: "スタンダード", en: "Standard" },
    tagline: {
      ja: "過去作品もまとめて楽しみたい方に",
      en: "For fans who want the back catalog too",
    },
    price: { ja: "1,500円", en: "¥1,500" },
    period: { ja: "/ 月", en: "/ month" },
    features: [
      {
        text: { ja: "最新イラストの先行公開", en: "Early access to new illustrations" },
        included: true,
      },
      {
        text: { ja: "限定Discordチャンネル（標準）", en: "Access to standard Discord channels" },
        included: true,
      },
      {
        text: {
          ja: "過去作品見放題（直近3ヶ月）",
          en: "Unlimited access to the last 3 months of releases",
        },
        included: true,
      },
      {
        text: { ja: "イラストZIP一括ダウンロード", en: "Bulk ZIP download of illustrations" },
        included: true,
      },
      {
        text: { ja: "ショップ割引・リクエスト権", en: "Shop discount & request privileges" },
        included: false,
      },
    ],
    patreonTierUrl: patreonMembershipUrl,
  },
  {
    id: "tier3",
    name: { ja: "プレミアム", en: "Premium" },
    tagline: {
      ja: "すべての特典を余すことなく",
      en: "Every single perk, without exception",
    },
    price: { ja: "10,000円", en: "¥10,000" },
    period: { ja: "/ 月", en: "/ month" },
    popular: true,
    badge: { ja: "一番人気", en: "MOST POPULAR" },
    customIcons: true,
    features: [
      {
        text: {
          ja: "🗝️ 秘密のDiscordチャンネルへご招待！",
          en: "🗝️ An invitation to the secret Discord channel!",
        },
        included: true,
      },
      {
        text: {
          ja: "💎 過去のエッチなイラストが全て見放題！",
          en: "💎 Unlimited access to every past illustration!",
        },
        included: true,
      },
      {
        text: { ja: "📦 イラストのZIP一括ダウンロード！", en: "📦 Bulk ZIP download of every illustration!" },
        included: true,
      },
      {
        text: { ja: "🎁 ショップ全商品がいつでも25%OFF！", en: "🎁 25% OFF everything in the shop, always!" },
        included: true,
      },
      {
        text: {
          ja: "🎨 【毎月限定】リクエスト対応！好きなキャラのオーダー同人誌を1冊制作！",
          en: "🎨 [Monthly, limited] Custom requests — a doujinshi starring your favorite character, made just for you!",
        },
        included: true,
      },
    ],
    patreonTierUrl: patreonMembershipUrl,
  },
];
