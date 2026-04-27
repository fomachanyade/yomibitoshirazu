// Cloudflare Workers ランタイム用エントリ。
// API は Hono に委譲し、静的ファイルは Workers Assets に丸投げする。
import { createApp } from "./app";
import { D1PoemRepo } from "./db/d1";

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    // API は Hono へ
    if (url.pathname.startsWith("/api/")) {
      const app = createApp(new D1PoemRepo(env.DB));
      return app.fetch(request, env, ctx);
    }

    // 静的ファイルは Assets に丸投げ。`html_handling: "auto-trailing-slash"` の
    // デフォルト挙動で /compose は /compose.html を、 / は /index.html を解決する。
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
