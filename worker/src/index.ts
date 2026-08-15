export interface Env {
  DB: D1Database;
}

const ALLOWED_ORIGINS = new Set([
  "https://at5fun.com",
  "https://at5fun-staging.aini-h-panda.workers.dev",
  "http://localhost:4321",
  "http://127.0.0.1:4321",
]);

function corsHeaders(origin: string | null): HeadersInit {
  const allow =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://at5fun.com";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(data: unknown, origin: string | null, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
      ...(init.headers ?? {}),
    },
  });
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "0.0.0.0";
    const ipHash = await hashIp(ip);

    if (request.method === "GET" && url.pathname === "/likes/ranking") {
      const limit = Math.min(
        Number(url.searchParams.get("limit") ?? 10) || 10,
        50,
      );

      // 期間別(daily/monthly/yearly)の切り替えは廃止し、累計いいね数によるリアルタイムランキングのみを返す
      const { results } = await env.DB.prepare(
        "SELECT slug, count FROM likes ORDER BY count DESC LIMIT ?1",
      )
        .bind(limit)
        .all();
      return json({ ranking: results ?? [] }, origin);
    }

    const likesMatch = url.pathname.match(/^\/likes\/([^/]+)$/);
    if (likesMatch) {
      const slug = decodeURIComponent(likesMatch[1]);

      if (request.method === "GET") {
        const [countRow, voteRow] = await Promise.all([
          env.DB.prepare("SELECT count FROM likes WHERE slug = ?1")
            .bind(slug)
            .first<{ count: number }>(),
          env.DB.prepare(
            "SELECT 1 FROM like_votes WHERE slug = ?1 AND ip_hash = ?2",
          )
            .bind(slug, ipHash)
            .first(),
        ]);
        // このIPが既にいいね済みかどうかをクライアントに返す。localStorageが消えていても
        // (別ブラウザ・シークレットモード・キャッシュ削除など)、再訪時に正しく「いいね済み」表示に戻せる
        return json(
          { slug, count: countRow?.count ?? 0, liked: Boolean(voteRow) },
          origin,
        );
      }

      if (request.method === "POST") {
        const existing = await env.DB.prepare(
          "SELECT 1 FROM like_votes WHERE slug = ?1 AND ip_hash = ?2",
        )
          .bind(slug, ipHash)
          .first();

        if (existing) {
          const row = await env.DB.prepare(
            "SELECT count FROM likes WHERE slug = ?1",
          )
            .bind(slug)
            .first<{ count: number }>();
          return json(
            { slug, count: row?.count ?? 0, alreadyLiked: true },
            origin,
          );
        }

        await env.DB.batch([
          env.DB.prepare(
            "INSERT INTO likes (slug, count) VALUES (?1, 1) ON CONFLICT(slug) DO UPDATE SET count = count + 1",
          ).bind(slug),
          env.DB.prepare(
            "INSERT INTO like_votes (slug, ip_hash, created_at) VALUES (?1, ?2, ?3)",
          ).bind(slug, ipHash, new Date().toISOString()),
        ]);

        const row = await env.DB.prepare(
          "SELECT count FROM likes WHERE slug = ?1",
        )
          .bind(slug)
          .first<{ count: number }>();
        return json(
          { slug, count: row?.count ?? 1, alreadyLiked: false },
          origin,
          {
            status: 201,
          },
        );
      }
    }

    return json({ error: "not_found" }, origin, { status: 404 });
  },
};
