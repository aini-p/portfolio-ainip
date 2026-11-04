CREATE TABLE IF NOT EXISTS likes (
  slug TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS like_votes (
  slug TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (slug, ip_hash)
);

-- ランキング(ORDER BY count DESC)を全件ソートせずに上位から読めるようにする
CREATE INDEX IF NOT EXISTS likes_count_idx ON likes (count DESC);
