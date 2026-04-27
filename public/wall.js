// 壁: APIから一首引いて流す。空なら少し待って再挑戦。
const stage = document.getElementById("stage");
let active = null;
let nextTimer = null;

async function fetchOne() {
  try {
    const res = await fetch("/api/poems/random", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json(); // Poem | null
  } catch {
    return null;
  }
}

function silence(ms) {
  return new Promise((r) => { nextTimer = setTimeout(r, ms); });
}

function flow(text) {
  return new Promise((resolve) => {
    const el = document.createElement("div");
    el.className = "poem";
    el.textContent = text;

    const yJitter = (Math.random() - 0.5) * 12;
    el.style.top = `calc(50% + ${yJitter}vh)`;
    stage.appendChild(el);

    const dur = 14000 + Math.random() * 4000;
    const anim = el.animate(
      [
        { transform: "translate(-100vw, -50%)", opacity: 0 },
        { transform: "translate(-100vw, -50%)", opacity: 1, offset: 0.07 },
        { transform: "translate(100vw, -50%)",  opacity: 1, offset: 0.93 },
        { transform: "translate(100vw, -50%)",  opacity: 0 },
      ],
      { duration: dur, easing: "linear", fill: "forwards" }
    );

    active = { el, anim };
    anim.onfinish = () => {
      el.remove();
      active = null;
      resolve();
    };
  });
}

async function loop() {
  // 開幕の小さな間
  await silence(600);

  while (true) {
    const poem = await fetchOne();
    if (poem) {
      await flow(poem.text);
    } else {
      // 空 or エラー時は長めに待つ
      await silence(8000);
      continue;
    }
    // 次の一首までの沈黙
    await silence(3000 + Math.random() * 7000);
  }
}

// タブが隠れたら気持ちだけ控える(完全停止はしない)
loop();
