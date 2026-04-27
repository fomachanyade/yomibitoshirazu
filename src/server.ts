// Bun ランタイム用エントリ。
// 静的ファイルは Bun.file で素直に返す。
import { Hono } from "hono";
import { openLocalDb } from "./db";
import { createApp } from "./app";

const PORT = Number(process.env.PORT ?? 3000);
const PUBLIC_DIR = new URL("../public/", import.meta.url).pathname;

const { repo } = openLocalDb();
const apiApp = createApp(repo);

// ルートのHono: API を載せて、それ以外は public/ を返す
const root = new Hono();
root.route("/", apiApp);

// ページルート (拡張子なしの URL を HTML にマッピング)
root.get("/", (c) => serveFile(c, "index.html"));
root.get("/compose", (c) => serveFile(c, "compose.html"));

// 静的アセット (style.css, *.js, favicon など)
root.get("/*", async (c) => {
  const path = c.req.path.replace(/^\/+/, "");
  if (!path) return c.notFound();
  return serveFile(c, path);
});

async function serveFile(c: any, relPath: string) {
  // パストラバーサル防止
  if (relPath.includes("..")) return c.notFound();
  const file = Bun.file(PUBLIC_DIR + relPath);
  if (!(await file.exists())) return c.notFound();
  return new Response(file);
}

console.log(`yomibitoshirazu → http://localhost:${PORT}`);

export default {
  port: PORT,
  fetch: root.fetch,
};
