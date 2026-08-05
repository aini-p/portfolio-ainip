import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://at5fun.com",
  devToolbar: {
    enabled: false,
  },
  integrations: [sitemap(), mdx()],
  prefetch: true,
  adapter: cloudflare(),
  vite: {
    ssr: {
      noExternal: ["smartypants"],
    },
  },
});
