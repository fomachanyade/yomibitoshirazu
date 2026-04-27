# NEXT — 引き継ぎメモ

最終更新: 2026-04-27

## 今の状態

- Bun + Hono + bun:sqlite でローカルが動く
- 壁 (`/`) と詠む画面 (`/compose`) が分かれてる
- API は GET `/api/poems/random`, POST `/api/poems`, GET `/api/poems/count` の3本
- 種詠9首、シードスクリプトあり (`bun run db:seed`)
- 動作確認済み (ローカルで全エンドポイントが通る)

## 次にやること

### 1. Cloudflare Workers + D1 への移植

これがメインタスク。
ローカル開発との差し替えだけで載るように設計済み。

- [ ] `src/db/d1.ts` に `D1PoemRepo` を実装する
  - `env.DB.prepare(sql).bind(...).first()` / `.run()` を使う
  - 既存の `BunSqlitePoemRepo` と同じインターフェイス (`PoemRepo`) を満たす
- [ ] `src/worker.ts` を新規作成 (Workers エントリポイント)
  - `createApp(repo)` を呼んで Hono アプリを組み立て、 `app.fetch` を export
  - 静的ファイルは Workers Assets を使う (wrangler.toml の `[assets]` に `directory = "./public"`)
- [ ] `wrangler.toml` を書く
  - `wrangler d1 create yomibitoshirazu` で DB 作成
  - `migrations/` ディレクトリを切って `db/schema.sql` をマイグレーションとして登録
- [ ] `package.json` のスクリプトに `deploy`, `cf:dev` を追加
- [ ] デプロイ後の動作確認

### 2. レート制限

連投を抑える。

- [ ] Cloudflare Rate Limiting (Workers の機能) で IP ベースの上限
- [ ] あるいは Durable Objects でカウンタ
- [ ] 上限の数字は仮で「1分に5首、1時間に20首」あたりから調整

### 3. 投稿の最低限の防御

今は空白チェックだけ。

- [ ] 改行だけ・記号だけの投稿を弾く
- [ ] URL を含む投稿を弾く (リンクスパム対策、世界観的にもURLは要らない)
- [ ] 同一テキストの大量投稿を弾く (重複検出)

ただし「投稿の質」を判定しに行かないこと。詠の良し悪しは判定しない。
明らかな攻撃ペイロードと明らかな機械的スパムだけ弾く。

### 4. 本番で消すもの

- [ ] `GET /api/poems/count` (デバッグ用、本番には不要)

## やらないこと (CLAUDE.md と重複するけど大事)

- ユーザーアカウント、ログイン、 OAuth
- "いいね"、返信、シェア、通知
- 投稿のタイムライン、新着、ランキング、検索
- アナリティクス、トラッキング、広告
- 投稿の編集・削除 UI (誰のものでもないので、編集も削除もない)

## 開いておくべき設計上の問い

- 件数が増えてきたら `ORDER BY RANDOM()` がいつ重くなるか測る
  - 数百万件くらいまでは大丈夫なはず
  - 重くなったら `WHERE id = (random integer)` パターンで近似ランダム化
- D1 は無料枠で運用できるか (1日5M reads, 100k writes 程度)
- 投稿の保管期間は無限でいいのか (ストレージ代との兼ね合い)
