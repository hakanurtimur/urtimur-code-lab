import type { PreviewPreset } from "@/features/live-session/types";

export type LiveClassStatus = "live" | "frozen" | "ended";
export type LiveClassFile = "html" | "css" | "js";
export type LiveClassSpotlight = "split" | "code" | "browser";
export type LiveClassSyncState = "idle" | "saving" | "live" | "error";

export type LiveClassDraft = {
  html: string;
  css: string;
  js: string;
  activeFile: LiveClassFile;
  cursorLine: number;
  updatedAtMs: number | null;
};

export type LiveClassDiscovery = {
  sessionId: string;
  active: boolean;
  status: LiveClassStatus;
  title: string;
  teacherUid: string;
  activeFile: LiveClassFile;
  spotlight: LiveClassSpotlight;
  previewPreset: PreviewPreset;
  startedAtMs: number | null;
  updatedAtMs: number | null;
  endedAtMs: number | null;
};

export type LiveClassPublishedSession = {
  sessionId: string;
  teacherUid: string;
  title: string;
  status: LiveClassStatus;
  activeFile: LiveClassFile;
  spotlight: LiveClassSpotlight;
  previewPreset: PreviewPreset;
  html: string;
  css: string;
  js: string;
  cursorLine: number;
  startedAtMs: number | null;
  updatedAtMs: number | null;
  endedAtMs: number | null;
};

export type LiveClassTemplate = {
  id: string;
  label: string;
  description: string;
  draft: Pick<LiveClassDraft, "html" | "css" | "js">;
};

export const DEFAULT_LIVE_CLASS_DRAFT: LiveClassDraft = {
  html: `<main class="demo-card">\n  <span class="eyebrow">CANLI KOD</span>\n  <h1>Merhaba 👋</h1>\n  <p>Birlikte kod yazmaya başlayalım.</p>\n</main>`,
  css: `* { box-sizing: border-box; }\nbody {\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  font-family: system-ui, sans-serif;\n  background: #f4f1ff;\n  color: #17182c;\n}\n.demo-card {\n  width: min(520px, calc(100% - 32px));\n  padding: 32px;\n  border-radius: 28px;\n  background: white;\n  box-shadow: 0 24px 70px rgba(65, 53, 140, .14);\n}\n.eyebrow {\n  color: #7568eb;\n  font-size: 12px;\n  font-weight: 800;\n  letter-spacing: .14em;\n}\nh1 { margin-bottom: 8px; }\np { color: #66697a; }`,
  js: `// JavaScript yazmak istediğinde bu dosyayı kullan.`,
  activeFile: "html",
  cursorLine: 1,
  updatedAtMs: null,
};

export const LIVE_CLASS_TEMPLATES: LiveClassTemplate[] = [
  {
    id: "starter",
    label: "Başlangıç",
    description: "Temiz, modern bir demo kartı.",
    draft: {
      html: DEFAULT_LIVE_CLASS_DRAFT.html,
      css: DEFAULT_LIVE_CLASS_DRAFT.css,
      js: DEFAULT_LIVE_CLASS_DRAFT.js,
    },
  },
  {
    id: "profile",
    label: "Profil kartı",
    description: "HTML + CSS anlatımı için hazır mini arayüz.",
    draft: {
      html: `<article class="profile">\n  <div class="avatar">HU</div>\n  <div>\n    <p class="tag">FRONTEND LAB</p>\n    <h1>Hakan Urtimur</h1>\n    <p>Bugün semantic HTML ve kart yapısını inceliyoruz.</p>\n    <a href="#konu">Konuya geç →</a>\n  </div>\n</article>`,
      css: `* { box-sizing: border-box; }\nbody { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #101426; color: #f8f8ff; font-family: system-ui, sans-serif; }\n.profile { width: min(680px, calc(100% - 32px)); display: grid; grid-template-columns: 96px 1fr; gap: 24px; padding: 30px; border: 1px solid rgba(255,255,255,.12); border-radius: 28px; background: #171c31; }\n.avatar { width: 96px; height: 96px; display: grid; place-items: center; border-radius: 28px; background: #7568eb; font-size: 28px; font-weight: 900; }\n.tag { color: #81d8f7; font-size: 12px; font-weight: 800; letter-spacing: .12em; }\nh1 { margin: 4px 0 10px; }\np { color: #b6b8c8; line-height: 1.6; }\na { color: #ffd66b; font-weight: 800; }`,
      js: `// Bu örnekte JavaScript gerekmiyor.`,
    },
  },
  {
    id: "interaction",
    label: "Buton etkileşimi",
    description: "HTML + CSS + JS üçlüsünü birlikte göster.",
    draft: {
      html: `<main class="counter">\n  <p class="tag">JAVASCRIPT DEMO</p>\n  <h1>Tıklama sayacı</h1>\n  <strong id="count">0</strong>\n  <button id="increase">Bir artır</button>\n</main>`,
      css: `* { box-sizing: border-box; }\nbody { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fff7e9; font-family: system-ui, sans-serif; color: #17182c; }\n.counter { min-width: 320px; padding: 32px; text-align: center; border-radius: 28px; background: white; box-shadow: 0 24px 70px rgba(120,90,22,.13); }\n.tag { color: #7568eb; font-size: 11px; font-weight: 900; letter-spacing: .14em; }\nstrong { display: block; margin: 18px; font-size: 56px; }\nbutton { border: 0; border-radius: 14px; padding: 12px 18px; background: #7568eb; color: white; font-weight: 800; cursor: pointer; }`,
      js: `const count = document.querySelector("#count");\nconst button = document.querySelector("#increase");\nlet value = 0;\n\nbutton.addEventListener("click", () => {\n  value += 1;\n  count.textContent = value;\n});`,
    },
  },
];
