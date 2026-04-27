// 詠データへのアクセス契約。
// ローカル(bun:sqlite)と本番(D1)で実装を差し替える。

export type Poem = {
  id: number;
  text: string;
  created_at: number;
};

export interface PoemRepo {
  insert(text: string): Promise<Poem>;
  random(): Promise<Poem | null>;
  count(): Promise<number>;
}
