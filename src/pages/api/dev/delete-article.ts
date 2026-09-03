import type { APIRoute } from "astro";

// このAPIは`astro dev`でのローカル確認時にのみ動作する。
// import.meta.env.DEVはビルド時に真偽値として静的に埋め込まれるため、本番ビルドでは
// 常にfalseとなり、下のnode:fsを使う実処理(deleteArticle)ごとバンドルから除去される。
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.DEV) {
    return new Response(JSON.stringify({ error: "not_found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const collection = (body as { collection?: unknown } | null)?.collection;
  const slug = (body as { slug?: unknown } | null)?.slug;

  if (
    (collection !== "artworks" && collection !== "doujinshi") ||
    typeof slug !== "string" ||
    slug.length === 0
  ) {
    return new Response(JSON.stringify({ error: "invalid_params" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { deleteArticle } = await import("~/server/deleteArticle");
    const result = await deleteArticle(collection, slug);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "delete_failed",
        message: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
