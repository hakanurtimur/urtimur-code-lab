# Firebase Student Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add teacher-managed Firebase student accounts, cloud progress, and live student code monitoring.

**Architecture:** Firebase client SDK handles teacher/student sessions and realtime Firestore listeners. Firebase Admin runs only in Next.js route handlers for privileged student account CRUD and teacher-token verification. Existing curriculum stays local and the current localStorage progress implementation remains as a fallback when Firebase is not configured.

**Tech Stack:** Next.js 16, React 19, TypeScript, Firebase Auth, Cloud Firestore, Firebase Admin SDK, CodeMirror, shadcn/ui, Motion, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-10-firebase-student-tracking-design.md`

## Global Constraints
- Student UX uses username/password only; no student email is displayed.
- No public signup.
- Teachers use email/password and must have custom claim `role: teacher`.
- Passwords never go to Firestore.
- Live code sync debounce is 750 ms.
- Curriculum content remains code-backed.
- App remains usable with local progress if Firebase public config is absent.

---

### Task 1: Firebase foundations and auth identity helpers
**Files:** package.json, `.env.example`, `src/lib/firebase/*`, tests.
- [x] Add Firebase client/admin dependencies and environment contract.
- [x] Test username normalization, synthetic student email generation, and password validation.
- [x] Implement client initialization and server Admin initialization.

### Task 2: Auth providers and login UI
**Files:** `src/features/auth/*`, `src/app/login/*`, `src/app/teacher/login/*`, layout.
- [x] Add auth session provider.
- [x] Add student username/password login.
- [x] Add teacher email/password login and role-claim check.
- [x] Add sign-out and route guards.

### Task 3: Teacher-authorized student CRUD API
**Files:** `src/app/api/teacher/students/*`, `src/lib/firebase/require-teacher.ts`, tests.
- [x] Verify Bearer token and teacher custom claim.
- [x] Create/list/update/delete student accounts with Firebase Admin.
- [x] Support active state, password reset, username rename, and progress reset.

### Task 4: Cloud progress integration
**Files:** `src/features/progress/*`, lesson workspace.
- [x] Preserve localStorage fallback.
- [x] For authenticated students, write/read per-lesson progress from Firestore.
- [x] Keep dashboard completion state in sync.

### Task 5: Live code and presence sync
**Files:** `src/features/live-session/*`, lesson workspace.
- [x] Sync code/task/test status at 750 ms debounce.
- [x] Heartbeat every 20 seconds.
- [x] Cleanly mark session idle on workspace exit when possible.

### Task 6: Teacher dashboard and live viewer
**Files:** `src/app/teacher/*`, `src/features/teacher/*`.
- [x] Build student CRUD UI.
- [x] Show progress and current lesson.
- [x] Listen to live session updates.
- [x] Render live code in read-only CodeMirror.

### Task 7: Firestore rules, teacher bootstrap, and docs
**Files:** `firestore.rules`, `firebase.json`, `scripts/set-teacher-claim.mjs`, README.
- [x] Add least-privilege rules.
- [x] Add one-time teacher custom-claim script.
- [x] Document exact Firebase Console and Vercel setup steps.

### Task 8: Verification and packaging
**Files:** tests and generated zip.
- [ ] Run tests, lint, and build when dependencies are available. — blocked here because npm registry DNS is unavailable; run after npm install on your machine.
- [x] Run static TypeScript/syntax verification if registry access prevents installation.
- [x] Package one final Firebase-enabled ZIP.
