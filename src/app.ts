// HonoアプリのコアはランタイムDB非依存にしておく。
// Bun でも Workers でも同じapp定義を使い回せる。
import { Hono } from "hono";
import type { PoemRepo } from "./db/types";
import { validatePoem } from "./validate";

export type AppEnv = {
  Variables: {
    repo: PoemRepo;
  };
};

export function createApp(repo: PoemRepo) {
  const app = new Hono<AppEnv>();

  // repo を全リクエストに注入
  app.use("*", async (c, next) => {
    c.set("repo", repo);
    await next();
  });

  // 一首引く。なければ null。
  app.get("/api/poems/random", async (c) => {
    const poem = await c.var.repo.random();
    return c.json(poem);
  });

  // 一首流す。
  app.post("/api/poems", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const v = validatePoem(body?.text);
    if (!v.ok) return c.json({ error: v.reason }, 400);

    const poem = await c.var.repo.insert(v.text);
    return c.json(poem, 201);
  });

  // 件数(デバッグ用、後で消してもいい)
  app.get("/api/poems/count", async (c) => {
    const n = await c.var.repo.count();
    return c.json({ count: n });
  });

  return app;
}
