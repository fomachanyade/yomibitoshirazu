-- 詠の壁
-- 名は付かない。誰が詠んだかも残さない。
CREATE TABLE IF NOT EXISTS poems (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  text       TEXT    NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
