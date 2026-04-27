# yomibitoshirazu

縦書きの俳句・短歌・川柳が、壁を流れていく。  
詠み人も読み手も、誰でもない。

## 設計の芯

- アカウントなし、名前なし、ログインなし
- 一画面に一首ずつ、左から右へゆっくり流れる
- どの詠も等価。新しい詠も古い詠も、自分の詠も他人の詠も、同じ確率で流れてくる
- 完全にステートレス: 壁に立つたびに、世界はまた新しく始まる

## アーキテクチャ

```
ブラウザ ──► Hono (Bun ローカル / Cloudflare Workers 本番)
              │
              ├─ GET  /             → 壁
              ├─ GET  /compose      → 詠む
              ├─ GET  /api/poems/random
              ├─ POST /api/poems
              └─ DB   bun:sqlite (ローカル) / D1 (本番)
```

DB アクセスは `PoemRepo` インターフェイスで抽象化しているので、
`bun:sqlite` 実装と D1 実装を差し替えるだけで Workers に載る。

## 走らせる

前提: [Bun](https://bun.sh/) がインストールされてること。

```bash
bun install
bun run db:seed   # 種詠を撒く(空のときだけ)
bun run dev       # http://localhost:3000
```

## ファイル

```
src/
  server.ts          Bun 用エントリ
  app.ts             Hono のルート定義 (Bun/Workers 共通)
  validate.ts        詠の検証
  db/
    types.ts         PoemRepo インターフェイス
    bun-sqlite.ts    bun:sqlite 実装
    index.ts         ローカルDBファクトリ
  scripts/
    seed.ts          種詠投入
public/
  index.html         壁
  compose.html       詠む画面
  style.css          共通スタイル
  wall.js            壁ロジック
  compose.js         投稿ロジック
db/
  schema.sql         スキーマ
```

## API

### `GET /api/poems/random`

ランダムに一首返す。空なら `null`。

```json
{ "id": 42, "text": "古池や\n蛙飛びこむ\n水の音", "created_at": 1729999999 }
```

### `POST /api/poems`

```json
{ "text": "..." }
```

→ 201 で作られた詠を返す。検証失敗なら 400。

## これから

- [ ] Cloudflare Workers + D1 にデプロイ
  - `wrangler.toml` を書く
  - `D1PoemRepo` を `src/db/d1.ts` に追加
  - Workers エントリ `src/worker.ts` を別途用意 (静的ファイルは `assets`)
- [ ] レート制限 (同IPからの連投抑制)
- [ ] 投稿の最低限のフィルタ (空白だけ、明らかな攻撃ペイロードなど)
- [ ] (任意) 件数 API は本番で消す
