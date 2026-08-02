export interface Env {
  DB: D1Database;
}

const ALLOWED_ORIGINS = new Set([
  "https://at5fun.com",
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
      const period = url.searchParams.get("period") ?? "all";

      if (period === "all") {
        const { results } = await env.DB.prepare(
          "SELECT slug, count FROM likes ORDER BY count DESC LIMIT ?1",
        )
          .bind(limit)
          .all();
        return json({ ranking: results ?? [], period }, origin);
      }

      const periodWindowMs: Record<string, number> = {
        daily: 24 * 60 * 60 * 1000,
        monthly: 30 * 24 * 60 * 60 * 1000,
        yearly: 365 * 24 * 60 * 60 * 1000,
      };
      const windowMs = periodWindowMs[period];
      if (!windowMs) {
        return json({ error: "invalid_period" }, origin, { status: 400 });
      }

      // like_votesは投票(いいね)1件ごとにcreated_atを持つため、直近N日分だけを
      // 集計すれば期間別ランキングになる（likesテーブルは累計のみでcreated_atを持たない）
      const since = new Date(Date.now() - windowMs).toISOString();
      const { results } = await env.DB.prepare(
        "SELECT slug, COUNT(*) as count FROM like_votes WHERE created_at >= ?1 GROUP BY slug ORDER BY count DESC LIMIT ?2",
      )
        .bind(since, limit)
        .all();
      return json({ ranking: results ?? [], period }, origin);
    }

    const likesMatch = url.pathname.match(/^\/likes\/([^/]+)$/);
    if (likesMatch) {
      const slug = decodeURIComponent(likesMatch[1]);

      if (request.method === "GET") {
        const row = await env.DB.prepare(
          "SELECT count FROM likes WHERE slug = ?1",
        )
          .bind(slug)
          .first<{ count: number }>();
        return json({ slug, count: row?.count ?? 0 }, origin);
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
