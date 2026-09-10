# Playful Learning UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a premium, pastel, child-friendly student experience and a calmer teacher command center without changing the Firebase or curriculum data model.

**Architecture:** Preserve current data hooks and routes, introduce reusable visual primitives and illustration components, then replace the three main surface components (student auth, curriculum dashboard, lesson workspace) and restyle the teacher surface. Design state stays local to each surface; Firebase hooks remain unchanged.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn-style primitives, Radix UI, motion/react, CodeMirror, Firebase Auth/Firestore.

**Spec:** `docs/superpowers/specs/2026-09-10-playful-learning-ui-design.md`

## Global Constraints

- Student UI must be playful but appropriate for a bright 13-year-old.
- No XP, levels, streaks, leaderboards, timers, or confetti.
- Existing Firebase auth, CRUD, progress, and live code behavior must remain intact.
- Existing curriculum TypeScript data remains the source of truth.
- Motion must respect `prefers-reduced-motion`.
- Preview device presets and visible editor caret must be preserved.
- Student UI has one primary CTA per section.

---

### Task 1: Add visual primitives and design contract

**Files:**
- Create: `src/components/code-buddy-illustration.tsx`
- Create: `src/components/circular-progress.tsx`
- Create: `src/components/learning-sticker.tsx`
- Create: `scripts/design-contract.test.mjs`
- Modify: `package.json`
- Test: `scripts/design-contract.test.mjs`

**Interfaces:**
- Produces: `CodeBuddyIllustration({ mood, className })`, `CircularProgress({ value, size, strokeWidth, label, tone })`, `LearningSticker({ icon, tone, label })`.

- [ ] Write the Node design-contract test that asserts the new primitives and required dashboard/workspace landmarks do not yet exist.
- [ ] Run `node --test scripts/design-contract.test.mjs` and verify it fails on missing primitives.
- [ ] Implement the three reusable primitives with accessible SVG markup and no external image dependency.
- [ ] Add `test:design` to `package.json`.
- [ ] Run the design-contract test and keep landmark assertions failing until the surface tasks are complete.
- [ ] Commit `feat: add playful learning visual primitives`.

### Task 2: Rebuild student login and session presentation

**Files:**
- Modify: `src/features/auth/student-login.tsx`
- Modify: `src/features/auth/teacher-login.tsx`
- Modify: `src/features/auth/session-controls.tsx`
- Modify: `src/features/auth/student-gate.tsx`
- Modify: `src/features/auth/teacher-gate.tsx`
- Modify: `src/features/auth/student-identity.test.ts`

**Interfaces:**
- Consumes: existing `useAuthSession`, `CodeBuddyIllustration`, shadcn input/button/card.
- Produces: login pages with `data-surface="student-login"` and `data-surface="teacher-login"`.

- [ ] Update auth tests to assert student identity behavior remains unchanged.
- [ ] Replace student login structure with visual panel, floating topic chips, login card, and clear local fallback.
- [ ] Restyle teacher login as a compact professional panel.
- [ ] Restyle loading gates and session controls without changing redirects or auth calls.
- [ ] Run static TypeScript parsing and the design-contract test.
- [ ] Commit `feat: redesign student and teacher authentication`.

### Task 3: Rebuild the student dashboard

**Files:**
- Create: `src/features/curriculum/components/continue-learning-card.tsx`
- Create: `src/features/curriculum/components/week-journey-card.tsx`
- Create: `src/features/curriculum/components/week-detail-panel.tsx`
- Modify: `src/features/curriculum/curriculum-dashboard.tsx`
- Modify: `src/features/curriculum/curriculum-dashboard.test.tsx`

**Interfaces:**
- Consumes: `CurriculumWeek`, completion IDs, `CircularProgress`, `LearningSticker`.
- Produces: dashboard landmarks `data-dashboard="student"`, `data-section="continue"`, `data-section="week-journey"`.

- [ ] Write/update dashboard tests for one continue link, eight week cards, and five selected weekly outcomes.
- [ ] Implement the hero continue card with personalized greeting and progress ring.
- [ ] Implement week journey cards with keyboard-accessible selection.
- [ ] Implement selected week detail with FCC blocks, outcomes, and original lessons.
- [ ] Add supporting learning-cycle and cloud-save cards.
- [ ] Run static parse and design-contract checks.
- [ ] Commit `feat: rebuild student learning dashboard`.

### Task 4: Rebuild the lesson workspace

**Files:**
- Create: `src/features/lesson-runner/components/mission-stage-card.tsx`
- Create: `src/features/lesson-runner/components/workspace-status.tsx`
- Modify: `src/features/lesson-runner/components/lesson-workspace.tsx`
- Modify: `src/features/lesson-runner/components/live-preview.tsx`
- Modify: `src/features/lesson-runner/components/code-editor.tsx`
- Modify: `src/features/lesson-runner/components/test-results.tsx`
- Modify: `src/features/lesson-runner/components/lesson-workspace.test.tsx`
- Modify: `src/features/lesson-runner/components/live-preview.test.tsx`
- Modify: `src/features/lesson-runner/components/test-results.test.tsx`

**Interfaces:**
- Preserves: `LessonWorkspace({ lesson, week })`, live session sync, progress recording, and preview preset behavior.
- Produces: workspace landmarks `data-workspace="lesson"`, `data-pane="mission|code|result"`.

- [ ] Update tests for mission stages, mobile pane controls, preview presets, test state, and completion CTA.
- [ ] Extract mission stage presentation and sync status presentation.
- [ ] Restructure the workspace into the new responsive three-pane/two-pane/mobile model.
- [ ] Improve editor header, visible caret styling, action dock, and sync feedback.
- [ ] Improve preview stage sizing and test summary placement while keeping real viewport scaling.
- [ ] Run static parse and design-contract checks.
- [ ] Commit `feat: rebuild playful lesson workspace`.

### Task 5: Restyle the teacher command center

**Files:**
- Modify: `src/features/teacher/teacher-dashboard.tsx`
- Modify: `src/features/teacher/types.ts` only if presentation-only derived fields need typing.
- Create: `src/features/teacher/teacher-dashboard.test.tsx`

**Interfaces:**
- Preserves: current teacher API calls, realtime hooks, CRUD, progress reset, delete confirmation, read-only CodeMirror.
- Produces: `data-dashboard="teacher"`, searchable roster, selected live-session command center.

- [ ] Add a teacher dashboard test for summary, roster, live editor, and account controls.
- [ ] Add local search and online-first derived ordering without changing backend queries.
- [ ] Recompose stats, roster, live code, progress, and account controls.
- [ ] Add polished empty/loading/error states.
- [ ] Run static parse and design-contract checks.
- [ ] Commit `feat: redesign teacher live classroom`.

### Task 6: Replace the global visual system and responsive behavior

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/brand.tsx`
- Modify: `src/components/brand.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: design tokens and all class contracts used by Tasks 2–5.

- [ ] Add tests for brand accessible name and product label.
- [ ] Replace global tokens, typography, layout, card, auth, dashboard, lesson, and teacher styles.
- [ ] Add responsive breakpoints for wide three-pane, medium switchable workspace, and mobile tabs.
- [ ] Add hover/media-query safeguards and reduced-motion rules.
- [ ] Verify focus-visible states and minimum control sizes.
- [ ] Run `node --test scripts/design-contract.test.mjs` and expect all assertions to pass.
- [ ] Commit `style: apply playful premium design system`.

### Task 7: Verification, documentation, and package

**Files:**
- Modify: `README.md`
- Create: `docs/UI_SYSTEM.md`

**Interfaces:**
- Produces: final distributable project archive.

- [ ] Document the student/teacher visual split, tokens, responsive model, and motion rules.
- [ ] Run `node --test scripts/design-contract.test.mjs`.
- [ ] Run the TypeScript transpile diagnostic script across all `.ts` and `.tsx` files.
- [ ] Attempt `npm test`, `npm run lint`, and `npm run build`; record any environment-related blocker exactly.
- [ ] Inspect git diff and verify no Firebase schema or curriculum data changes.
- [ ] Create `/mnt/data/hakan-urtimur-code-lab-firebase-playful-ui.zip` excluding `.git`, `.worktrees`, `node_modules`, and local env files.
- [ ] Commit `docs: document playful UI system`.
