// 種詠を入れる。空のときだけ。
import { openLocalDb } from "../db";

const SEEDS = [
  "古池や\n蛙飛びこむ\n水の音",
  "閑かさや\n岩にしみ入る\n蝉の声",
  "夏草や\n兵どもが\n夢の跡",
  "終電を\n逃して見上げる\n星ひとつ",
  "コンビニの\n灯に集まる\n蛾と私",
  "誰も来ぬ\n駅のホームに\n雪が降る",
  "改札を\n抜けて世界が\n少し変わる",
  "猫の眼に\n夕日まるごと\n吸われゆく",
  "雨の夜\n知らない街の\n知らない灯",
];

const { repo } = openLocalDb();
const existing = await repo.count();
if (existing > 0) {
  console.log(`既に ${existing} 首あるので種は撒かない。`);
  process.exit(0);
}

for (const text of SEEDS) {
  await repo.insert(text);
}
console.log(`${SEEDS.length} 首を撒いた。`);
