import { defineMiddleware } from "astro:middleware";
import { defaultLang } from "./i18n/ui";

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  // URLが /en または /en/ で始まる場合は英語
  if (pathname.startsWith('/en/') || pathname === '/en') {
    context.locals.lang = 'en';
  } else {
    // それ以外（ルートパス '/' を含む）はすべてデフォルト言語（日本語）
    context.locals.lang = defaultLang;
  }
  
  return next();
});