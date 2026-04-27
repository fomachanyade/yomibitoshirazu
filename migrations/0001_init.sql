-- 初期スキーマ。db/schema.sql と同期させること。
CREATE TABLE IF NOT EXISTS poems (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  text       TEXT    NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
