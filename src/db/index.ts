import { Database } from "bun:sqlite";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BunSqlitePoemRepo } from "./bun-sqlite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function openLocalDb(path = "yomibitoshirazu.db") {
  const db = new Database(path, { create: true });
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");

  const schema = readFileSync(
    join(__dirname, "..", "..", "db", "schema.sql"),
    "utf8",
  );
  db.exec(schema);

  return { db, repo: new BunSqlitePoemRepo(db) };
}
