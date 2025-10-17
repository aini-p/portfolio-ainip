import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://mysite.com",
  devToolbar: {
    enabled: false,
  },
  integrations: [sitemap(), mdx()],
  prefetch: true,
  vite: {
    ssr: {
      noExternal: ["smartypants"],
    },
  },
});