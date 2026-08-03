export interface FeatureHighlight {
  icon: string;
  title: { ja: string; en: string };
  desc: { ja: string; en: string };
}

// セクション2: 特典のダイジェスト
export const membershipFeatureHighlights: FeatureHighlight[] = [
  {
    icon: "🔑",
    title: { ja: "シークレットコミュニティ", en: "Secret Community" },
    desc: {
      ja: "会員限定のDiscordサーバーで、作者やファン同士と気軽に交流できます。",
      en: "Chat directly with the creator and fellow fans in a members-only Discord server.",
    },
  },
  {
    icon: "💎",
    title: { ja: "全作品見放題", en: "Unlimited Back Catalog" },
    desc: {
      ja: "過去に公開した全イラストのアーカイブを、いつでも好きなだけ閲覧できます。",
      en: "Browse the full archive of past illustrations any time you like.",
    },
  },
  {
    icon: "📦",
    title: { ja: "高画質一括ダウンロード", en: "Bulk HQ Downloads" },
    desc: {
      ja: "お気に入りのイラストをまとめてZIPで一括ダウンロードできます。",
      en: "Download your favorite illustrations together in a single high-res ZIP.",
    },
  },
  {
    icon: "🎁",
    title: { ja: "ショップ特別割引", en: "Shop Discount" },
    desc: {
      ja: "同人誌・グッズなどショップの全商品が常時25%OFFになります。",
      en: "Get 25% off every item in the shop — doujinshi, goods, everything — always.",
    },
  },
  {
    icon: "🎨",
    title: { ja: "オーダー同人誌制作", en: "Custom Doujinshi Commission" },
    desc: {
      ja: "トップTier限定で、好きなキャラクター・シチュエーションのオーダー同人誌を制作します。",
      en: "Exclusive to the top tier: a custom doujinshi made to order with the character and scenario you choose.",
    },
  },
];

export interface TopTierHighlight {
  image: string;
  imageAlt: { ja: string; en: string };
  title: { ja: string; en: string };
  body: { ja: string; en: string };
  note?: { ja: string; en: string };
}

// セクション4: トップTier特典の深掘り
export const topTierHighlights: TopTierHighlight[] = [
  {
    image: "/images/placeholder-membership-top-1.svg",
    imageAlt: { ja: "オーダー同人誌のイメージ", en: "Custom doujinshi commission preview" },
    title: {
      ja: "🎨 あなたのためだけに描く「オーダー同人誌」",
      en: "🎨 A Custom Doujinshi, Drawn Just for You",
    },
    body: {
      ja: "好きなキャラクターやシチュエーションを指定して、自分だけの限定同人誌を制作・お届けします。",
      en: "Tell us the character and scenario you want, and we'll create a one-of-a-kind doujinshi just for you.",
    },
    note: {
      ja: "※月あたりの制作数には限りがございます",
      en: "*A limited number of commissions are accepted each month",
    },
  },
  {
    image: "/images/placeholder-membership-top-2.svg",
    imageAlt: { ja: "過去作アーカイブ見放題のイメージ", en: "Unlimited archive preview" },
    title: {
      ja: "💎 過去のアーカイブ全見放題 ＆ 📦 一括ZIP DL",
      en: "💎 The Entire Archive, Unlocked — Plus 📦 Bulk ZIP Downloads",
    },
    body: {
      ja: "加入した瞬間から過去の数百枚におよぶ高画質イラストが一気に閲覧・保存可能に。",
      en: "The moment you join, hundreds of past high-resolution illustrations are unlocked for viewing and saving.",
    },
  },
  {
    image: "/images/placeholder-membership-top-3.svg",
    imageAlt: { ja: "ショップ割引と秘密のDiscordのイメージ", en: "Shop discount and secret Discord preview" },
    title: {
      ja: "🎁 ショップ全品25%OFF ＆ 🗝️ 秘密のDiscord",
      en: "🎁 25% Off Everything in the Shop — Plus 🗝️ A Secret Discord",
    },
    body: {
      ja: "同人誌やグッズ購入も常に25%OFF。ファン同士や作者と直接繋がれるシークレット空間へ。",
      en: "Doujinshi and goods purchases are always 25% off. Step into a secret space to connect directly with the creator and fellow fans.",
    },
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
      ja: "オーダー同人誌のリクエスト手順や納期はどうなりますか？",
      en: "How does the custom doujinshi request process work, and what's the turnaround?",
    },
    answer: {
      ja: "トップTierにご加入いただくと専用のリクエストフォームが開放されます。毎月上旬に受付を行い、内容確認の上、当月中〜翌月中を目安に制作・お届けします。ご希望が集中した場合は先着順とさせていただきます。",
      en: "Once you join the top tier, a dedicated request form unlocks. We open requests at the start of each month and typically deliver within that month or the next, depending on demand. Requests are handled on a first-come, first-served basis.",
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
