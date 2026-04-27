// 詠を投稿して壁に戻る。
const input  = document.getElementById("poemInput");
const submit = document.getElementById("submitBtn");

let imeComposing = false;
input.addEventListener("compositionstart", () => { imeComposing = true; });
input.addEventListener("compositionend",   () => { imeComposing = false; });

input.addEventListener("input", () => {
  submit.disabled = input.value.trim().length === 0;
});

async function release() {
  if (imeComposing) return;
  const text = input.value.trim();
  if (!text) return;

  submit.disabled = true;
  try {
    const res = await fetch("/api/poems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      submit.disabled = false;
      return; // 必要なら後でエラー表示
    }
    document.body.classList.add("releasing");
    setTimeout(() => { window.location.href = "/"; }, 380);
  } catch {
    submit.disabled = false;
  }
}

submit.addEventListener("click", release);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.location.href = "/";
  } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    release();
  }
});
