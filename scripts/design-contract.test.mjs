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

test("student surfaces expose stable semantic landmarks", () => {
  const login = read("src/features/auth/student-login.tsx");
  const dashboard = read("src/features/curriculum/curriculum-dashboard.tsx");
  const workspace = read("src/features/lesson-runner/components/lesson-workspace.tsx");

  assert.match(login, /data-surface="student-login"/);
  assert.match(dashboard, /data-dashboard="student"/);
  assert.match(dashboard, /data-section="continue"/);
  assert.match(dashboard, /data-section="week-journey"/);
  assert.match(workspace, /data-workspace="lesson"/);
  assert.match(workspace, /data-pane="mission"/);
  assert.match(workspace, /data-pane="code"/);
  assert.match(workspace, /data-pane="result"/);
});

test("teacher surface exposes a live classroom landmark", () => {
  const teacherLogin = read("src/features/auth/teacher-login.tsx");
  const teacherDashboard = read("src/features/teacher/teacher-dashboard.tsx");

  assert.match(teacherLogin, /data-surface="teacher-login"/);
  assert.match(teacherDashboard, /data-dashboard="teacher"/);
  assert.match(teacherDashboard, /data-section="live-classroom"/);
});

test("the global stylesheet defines the premium learning tokens", () => {
  const css = read("src/app/globals.css");

  assert.match(css, /--violet:/);
  assert.match(css, /--lavender:/);
  assert.match(css, /--peach:/);
  assert.match(css, /--sky:/);
  assert.match(css, /--mint:/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});


test("lesson workspace preserves a visible caret and real device presets", () => {
  const css = read("src/app/globals.css");
  const preview = read("src/features/lesson-runner/components/live-preview.tsx");
  const editor = read("src/features/lesson-runner/components/code-editor.tsx");

  assert.match(css, /\.code-editor \.cm-cursor[\s\S]*border-left: 2px solid #ffe66d/);
  assert.match(preview, /desktop: \{ label: "Desktop", width: 1280, height: 800/);
  assert.match(preview, /tablet: \{ label: "Tablet", width: 768, height: 1024/);
  assert.match(preview, /mobile: \{ label: "Mobile", width: 390, height: 844/);
  assert.match(editor, /ariaLabel = "HTML kod editörü"/);
});

test("teacher live code remains read-only and student UI avoids pressure mechanics", () => {
  const teacher = read("src/features/teacher/teacher-dashboard.tsx");
  const dashboard = read("src/features/curriculum/curriculum-dashboard.tsx");
  const login = read("src/features/auth/student-login.tsx");

  assert.match(teacher, /<CodeEditor[\s\S]*readOnly/);
  assert.doesNotMatch(`${dashboard}\n${login}`, /\bXP\b|leaderboard|streak|confetti/i);
});
