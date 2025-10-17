/// <reference types="astro/client" />

// ▼▼▼ この部分を追記します ▼▼▼
declare namespace App {
  interface Locals extends Runtime {
    lang: "ja" | "en";
  }
}
// ▲▲▲ ここまで ▲▲▲