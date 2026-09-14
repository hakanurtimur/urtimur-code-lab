import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("playful visual primitives exist", () => {
  const buddy = read("src/components/code-buddy-illustration.tsx");
  const ring = read("src/components/circular-progress.tsx");
  const sticker = read("src/components/learning-sticker.tsx");

  assert.match(buddy, /export function CodeBuddyIllustration/);
  assert.match(buddy, /role="img"/);
  assert.match(ring, /export function CircularProgress/);
  assert.match(ring, /aria-label/);
  assert.match(sticker, /export function LearningSticker/);
});

test("student surfaces expose an inline learning route and lesson navigation", () => {
  const login = read("src/features/auth/student-login.tsx");
  const dashboard = read("src/features/curriculum/curriculum-dashboard.tsx");
  const learningPath = read("src/features/curriculum/components/learning-path.tsx");
  const workspace = read("src/features/lesson-runner/components/lesson-workspace.tsx");

  assert.match(login, /data-surface="student-login"/);
  assert.match(dashboard, /data-dashboard="student"/);
  assert.match(dashboard, /data-section="continue"/);
  assert.match(learningPath, /data-section="learning-path"/);
  assert.match(learningPath, /learning-path-draw-line/);
  assert.match(workspace, /data-workspace="lesson"/);
  assert.match(workspace, /<LessonNavigation/);
  assert.match(workspace, /<LessonDrawer/);
  assert.match(workspace, /<LessonCompletionCard/);
});

test("teacher surface exposes live code, browser, and route access", () => {
  const teacherLogin = read("src/features/auth/teacher-login.tsx");
  const teacherDashboard = read("src/features/teacher/teacher-dashboard.tsx");
  const liveWorkspace = read("src/features/teacher/components/teacher-live-workspace.tsx");
  const liveBrowser = read("src/features/teacher/components/teacher-live-browser.tsx");

  assert.match(teacherLogin, /data-surface="teacher-login"/);
  assert.match(teacherDashboard, /data-dashboard="teacher"/);
  assert.match(teacherDashboard, /data-section="live-classroom"/);
  assert.match(teacherDashboard, /<WeekUnlockControl/);
  assert.match(liveWorkspace, /Bölünmüş/);
  assert.match(liveWorkspace, /<CodeEditor[\s\S]*readOnly/);
  assert.match(liveBrowser, /<PreviewViewport/);
});

test("the global stylesheet defines wide shells, three panes, and motion-safe path UI", () => {
  const css = read("src/app/globals.css");

  assert.match(css, /--violet:/);
  assert.match(css, /--lavender:/);
  assert.match(css, /--peach:/);
  assert.match(css, /--sky:/);
  assert.match(css, /--mint:/);
  assert.match(css, /\.student-dashboard-shell[\s\S]*max-width:\s*1520px/);
  assert.match(css, /\.teacher-dashboard-shell[\s\S]*max-width:\s*1600px/);
  assert.match(css, /@media \(min-width:\s*1440px\)[\s\S]*\.lesson-workspace-grid[\s\S]*grid-template-columns/);
  assert.match(css, /\.learning-path-week\.is-current[\s\S]*animation:/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("preview keeps a visible caret and real synchronized device presets", () => {
  const css = read("src/app/globals.css");
  const viewport = read("src/features/lesson-runner/components/preview-viewport.tsx");
  const editor = read("src/features/lesson-runner/components/code-editor.tsx");
  const sync = read("src/features/live-session/use-live-session-sync.ts");

  assert.match(css, /\.code-editor \.cm-cursor[\s\S]*border-left: 2px solid #ffe66d/);
  assert.match(viewport, /desktop: \{ label: "Desktop", width: 1280, height: 800/);
  assert.match(viewport, /tablet: \{ label: "Tablet", width: 768, height: 1024/);
  assert.match(viewport, /mobile: \{ label: "Mobile", width: 390, height: 844/);
  assert.match(viewport, /sandbox\s*=\s*"allow-same-origin"/);
  assert.match(viewport, /sandbox=\{sandbox\}/);
  assert.match(sync, /previewPreset/);
  assert.match(sync, /previewScrollY/);
  assert.match(editor, /ariaLabel = "HTML kod editörü"/);
});

test("student UI avoids pressure mechanics", () => {
  const dashboard = read("src/features/curriculum/curriculum-dashboard.tsx");
  const login = read("src/features/auth/student-login.tsx");
  const learningPath = read("src/features/curriculum/components/learning-path.tsx");

  assert.doesNotMatch(`${dashboard}\n${login}\n${learningPath}`, /\bXP\b|leaderboard|streak|confetti/i);
});

test("student presence is global and teacher monitoring is separate from lesson live state", () => {
  const providers = read("src/app/providers.tsx");
  const presence = read("src/features/presence/student-presence-bridge.tsx");
  const teacher = read("src/features/teacher/teacher-dashboard.tsx");

  assert.match(providers, /<StudentPresenceBridge/);
  assert.match(presence, /collection|presence/);
  assert.match(presence, /HEARTBEAT_MS/);
  assert.match(teacher, /useStudentPresence/);
});

test("topic games are data driven and remain optional reinforcement", () => {
  const games = read("src/features/games/data/basic-html-games.ts");
  const week = read("src/features/curriculum/components/learning-path-week.tsx");
  const player = read("src/features/games/components/game-player.tsx");

  assert.match(games, /w1-tag-attribute-repair/);
  assert.match(games, /w8-path-maze/);
  assert.match(week, /<GameCard/);
  assert.match(player, /Cevapları kontrol et/);
});
