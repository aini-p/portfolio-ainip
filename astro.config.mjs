import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// `astro dev`はCloudflareアダプタがあるとworkerd上で動き、起動・初回表示が遅い。
// サイトはCloudflareのバインディングを使っていないため、通常の`npm run dev`ではアダプタを外して
// Node上で動かす。本番に近いworkerd環境で確かめたい場合は`npm run dev:cf`を使う
const isDev = process.argv.includes("dev");
const useCloudflareInDev = process.env.npm_lifecycle_event === "dev:cf";

export default defineConfig({
  site: "https://at5fun.com",
  devToolbar: {
    enabled: false,
  },
  integrations: [sitemap(), mdx()],
  prefetch: true,
  adapter: isDev && !useCloudflareInDev ? undefined : cloudflare(),
  vite: {
    ssr: {
      noExternal: ["smartypants"],
    },
  },
});
