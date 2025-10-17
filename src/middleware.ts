import { defineMiddleware } from "astro:middleware";
import { languages, defaultLang } from "./i18n/ui";

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;
  const pathLang = pathname.split('/')[1];
  
  // URLから言語を判定し、Astroの共有データ(locals)に保存
  if (pathLang in languages) {
    context.locals.lang = pathLang as keyof typeof languages;
  } else {
    context.locals.lang = defaultLang;
  }
  
  return next();
});