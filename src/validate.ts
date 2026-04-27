// 詠の検証。長さだけ最低限。
// 内容のフィルタは今は入れない(投稿削除手段がないので、必要になったら考える)。

export const MAX_LEN = 140;

export type Validated = { ok: true; text: string } | { ok: false; reason: string };

export function validatePoem(raw: unknown): Validated {
  if (typeof raw !== "string") {
    return { ok: false, reason: "text must be a string" };
  }
  // CRLF を LF に正規化、両端の空白を落とす
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (text.length === 0) {
    return { ok: false, reason: "empty" };
  }
  if (text.length > MAX_LEN) {
    return { ok: false, reason: `too long (>${MAX_LEN})` };
  }
  return { ok: true, text };
}
