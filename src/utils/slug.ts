// Windows のファイルシステムで使えない文字（コロン等）を含む作品タイトル/キャラ名を
// 静的ビルドのディレクトリ名・URLセグメントとして安全に使えるよう置換する。
export function toPathSafeSlug(value: string): string {
  return value.replace(/[:*?"<>|]/g, "-");
}
