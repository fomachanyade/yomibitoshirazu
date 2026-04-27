// ローカル開発用。bun:sqlite で動かす。
import { Database } from "bun:sqlite";
import type { Poem, PoemRepo } from "./types";

export class BunSqlitePoemRepo implements PoemRepo {
  constructor(private db: Database) {}

  async insert(text: string): Promise<Poem> {
    const stmt = this.db.query<Poem, [string]>(
      `INSERT INTO poems (text) VALUES (?)
       RETURNING id, text, created_at`,
    );
    const row = stmt.get(text);
    if (!row) throw new Error("insert failed");
    return row;
  }

  async random(): Promise<Poem | null> {
    // 件数が増えても十分速い。何百万件レベルになったら考え直す。
    const stmt = this.db.query<Poem, []>(
      `SELECT id, text, created_at
       FROM poems
       ORDER BY RANDOM()
       LIMIT 1`,
    );
    return stmt.get() ?? null;
  }

  async count(): Promise<number> {
    const stmt = this.db.query<{ n: number }, []>(
      `SELECT COUNT(*) AS n FROM poems`,
    );
    return stmt.get()?.n ?? 0;
  }
}
