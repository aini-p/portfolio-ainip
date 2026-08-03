export interface FeatureHighlight {
  icon: string;
  title: { ja: string; en: string };
  desc: { ja: string; en: string };
  /** 誤認を避けるため、どのプランで使える特典かを明示するラベル */
  availability: { ja: string; en: string };
}

// セクション2: 特典のダイジェスト（プランによって対象が異なるため、各カードに対象プランを明記する）
export const membershipFeatureHighlights: FeatureHighlight[] = [
  {
    icon: "🗝️",
    title: { ja: "シークレットDiscord", en: "Secret Discord" },
    desc: {
      ja: "限定Discordチャンネルにご招待。作者やファン同士と気軽に交流できます。",
      en: "Get invited to an exclusive Discord channel and chat directly with the creator and fellow fans.",
    },
    availability: { ja: "全プラン共通", en: "All plans" },
  },
  {
    icon: "🔰",
    title: { ja: "新作イラスト見放題", en: "New Releases, Unlimited" },
    desc: {
      ja: "直近1か月に公開したエッチな新作イラストを見放題でお楽しみいただけます。",
      en: "Enjoy unlimited access to the newest illustrations published in the last month.",
    },
    availability: { ja: "全プラン対象", en: "All plans" },
  },
  {
    icon: "💎",
    title: { ja: "過去アーカイブ全見放題", en: "Full Back Catalog" },
    desc: {
      ja: "これまで公開した数千枚におよぶイラストのアーカイブを、いつでも好きなだけ閲覧できます。",
      en: "Browse thousands of past illustrations from the full archive, any time you like.",
    },
    availability: { ja: "常連さん・パートナーさん", en: "Standard and above" },
  },
  {
    icon: "📦",
    title: { ja: "ZIP一括ダウンロード", en: "Bulk ZIP Download" },
    desc: {
      ja: "お気に入りのイラストをまとめてZIPで一括保存できます。",
      en: "Save your favorite illustrations together in a single ZIP file.",
    },
    availability: { ja: "常連さん・パートナーさん", en: "Standard and above" },
  },
  {
    icon: "🎁",
    title: { ja: "ショップ全品25%OFF", en: "25% Off the Shop" },
    desc: {
      ja: "同人誌・グッズなどショップの全商品が常時25%OFFに。どこよりもお得に購入できます。",
      en: "Every doujinshi and item in the shop is always 25% off — the best price you'll find anywhere.",
    },
    availability: { ja: "常連さん・パートナーさん", en: "Standard and above" },
  },
  {
    icon: "🎨",
    title: { ja: "オーダーイラスト", en: "Custom Illustration Requests" },
    desc: {
      ja: "好きなキャラクターの同人誌から、痛車用の高解像度データまで。ご相談に応じて自由な用途のイラストを制作します。",
      en: "From a doujinshi starring your favorite character to high-resolution art for itasha car wraps — we'll work with you to create almost anything.",
    },
    availability: { ja: "パートナーさんだけ", en: "Partner only" },
  },
];

export interface FaqItem {
  question: { ja: string; en: string };
  answer: { ja: string; en: string };
}

// セクション5: FAQ
export const membershipFaq: FaqItem[] = [
  {
    question: {
      ja: "途中でプランを変更することはできますか？",
      en: "Can I change my plan later?",
    },
    answer: {
      ja: "はい、いつでもマイページからプランの変更・解約が可能です。アップグレードの場合は即時反映、ダウングレードの場合は次の請求サイクルから適用されます。",
      en: "Yes — you can upgrade, downgrade, or cancel any time from your account page. Upgrades apply immediately, and downgrades take effect from the next billing cycle.",
    },
  },
  {
    question: {
      ja: "Discordの連携方法がわかりません。",
      en: "I'm not sure how to link my Discord account.",
    },
    answer: {
      ja: "ご登録後にお送りするメールに手順を記載しています。Patreonアカウント設定からDiscordを連携いただくと、加入プランに応じたロールが自動で付与されます。",
      en: "The steps are included in the email we send after you join. Link your Discord account from your Patreon account settings, and you'll automatically receive the role that matches your plan.",
    },
  },
  {
    question: {
      ja: "支払い方法は何に対応していますか？",
      en: "What payment methods are supported?",
    },
    answer: {
      ja: "クレジットカード（Visa / Mastercard / American Express）および一部地域ではPayPalにも対応しています。決済はPatreonを通じて安全に処理されます。",
      en: "We accept major credit cards (Visa, Mastercard, American Express) and PayPal in supported regions. All payments are processed securely through Patreon.",
    },
  },
];
