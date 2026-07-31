export interface Env {
  DB: D1Database;
  TURNSTILE_SECRET?: string;
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

interface CommentPayload {
  author?: string;
  body?: string;
  lang?: string;
  turnstileToken?: string;
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

    const commentsMatch = url.pathname.match(/^\/comments\/([^/]+)$/);
    if (commentsMatch) {
      const slug = decodeURIComponent(commentsMatch[1]);

      if (request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT id, author, body, created_at FROM comments WHERE slug = ?1 ORDER BY created_at DESC LIMIT 100",
        )
          .bind(slug)
          .all();
        return json({ comments: results ?? [] }, origin);
      }

      if (request.method === "POST") {
        const payload = await request.json<CommentPayload>().catch(() => null);
        if (
          !payload ||
          typeof payload.body !== "string" ||
          payload.body.trim().length === 0
        ) {
          return json({ error: "invalid_body" }, origin, { status: 400 });
        }
        if (payload.body.length > 1000) {
          return json({ error: "too_long" }, origin, { status: 400 });
        }

        if (env.TURNSTILE_SECRET) {
          const verifyRes = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                secret: env.TURNSTILE_SECRET,
                response: payload.turnstileToken ?? "",
                remoteip: ip,
              }),
            },
          );
          const verify = await verifyRes.json<{ success: boolean }>();
          if (!verify.success) {
            return json({ error: "bot_check_failed" }, origin, { status: 403 });
          }
        }

        const recent = await env.DB.prepare(
          "SELECT created_at FROM comments WHERE slug = ?1 AND ip_hash = ?2 ORDER BY created_at DESC LIMIT 1",
        )
          .bind(slug, ipHash)
          .first<{ created_at: string }>();
        if (
          recent &&
          Date.now() - new Date(recent.created_at).getTime() < 30_000
        ) {
          return json({ error: "rate_limited" }, origin, { status: 429 });
        }

        const author = (payload.author ?? "").slice(0, 50).trim();
        const lang = payload.lang === "en" ? "en" : "ja";
        const createdAt = new Date().toISOString();

        await env.DB.prepare(
          "INSERT INTO comments (slug, lang, author, body, created_at, ip_hash) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        )
          .bind(slug, lang, author, payload.body.trim(), createdAt, ipHash)
          .run();

        return json(
          { author, body: payload.body.trim(), created_at: createdAt },
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
