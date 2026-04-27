// 本番(Cloudflare D1)用。bun:sqlite と同じ PoemRepo を満たす。
import type { Poem, PoemRepo } from "./types";

export class D1PoemRepo implements PoemRepo {
  constructor(private db: D1Database) {}

  async insert(text: string): Promise<Poem> {
    const row = await this.db
      .prepare(
        `INSERT INTO poems (text) VALUES (?)
         RETURNING id, text, created_at`,
      )
      .bind(text)
      .first<Poem>();
    if (!row) throw new Error("insert failed");
    return row;
  }

  async random(): Promise<Poem | null> {
    return await this.db
      .prepare(
        `SELECT id, text, created_at
         FROM poems
         ORDER BY RANDOM()
         LIMIT 1`,
      )
      .first<Poem>();
  }

  async count(): Promise<number> {
    const row = await this.db
      .prepare(`SELECT COUNT(*) AS n FROM poems`)
      .first<{ n: number }>();
    return row?.n ?? 0;
  }
}
