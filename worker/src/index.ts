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

const RANKING_CACHE_SECONDS = 300;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handle(request, env);
    } catch (error) {
      // 未捕捉の例外でWorkerごと落ちると(error 1101)CORSヘッダの無い500になり原因も追えないため、
      // ログに残した上でJSONの503を返す。サイト側は失敗時に静的スナップショットへフォールバックする
      console.error(error);
      return json({ error: "internal_error" }, request.headers.get("Origin"), {
        status: 503,
      });
    }
  },
};

async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "0.0.0.0";
  const ipHash = await hashIp(ip);

  if (request.method === "GET" && url.pathname === "/likes/ranking") {
    // サイト側は投稿記事・自作同人誌・他者作品レビューの3種を1本のランキングから絞り込むため、
    // 上限が小さいと件数の少ない種別(レビューなど)が圏外に押し出されて表示されなくなる
    const limit = Math.min(
      Number(url.searchParams.get("limit") ?? 10) || 10,
      200,
    );

    // ランキングは1ページ表示ごとに複数ブロックから呼ばれるため、毎回D1を読むと無料枠の
    // 1日あたり読み取り行数上限を使い切ってしまう(超過するとその日はAPIごと使えなくなる)。
    // 結果をエッジのキャッシュに数分間保持し、D1を読むのはキャッシュ切れの時だけにする。
    // CORSヘッダはリクエスト元ごとに変わるため、キャッシュには本文だけを入れて返す時に付ける
    const cache = caches.default;
    const cacheKey = new Request(`${url.origin}/likes/ranking?limit=${limit}`, {
      method: "GET",
    });
    const cached = await cache.match(cacheKey);
    if (cached) {
      return json(await cached.json(), origin);
    }

    // 期間別(daily/monthly/yearly)の切り替えは廃止し、累計いいね数によるランキングのみを返す
    const { results } = await env.DB.prepare(
      "SELECT slug, count FROM likes ORDER BY count DESC LIMIT ?1",
    )
      .bind(limit)
      .all();
    const body = { ranking: results ?? [] };
    await cache.put(
      cacheKey,
      new Response(JSON.stringify(body), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `max-age=${RANKING_CACHE_SECONDS}`,
        },
      }),
    );
    return json(body, origin);
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
}
