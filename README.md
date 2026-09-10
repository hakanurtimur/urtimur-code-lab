# Hakan Urtimur Code Lab

A creative, practice-first companion for the freeCodeCamp Responsive Web Design curriculum. The current release combines an original eight-week Basic HTML program with a playful premium student experience, a serious coding workspace, Firebase cloud progress, and a realtime teacher command center.

## What is included

- Next.js 16 + TypeScript
- Tailwind CSS v4 + shadcn-style primitives
- Original Code Buddy SVG illustration and pastel learning-card system
- Motion transitions with reduced-motion support
- CodeMirror HTML editor with Desktop / Tablet / Mobile preview
- 8-week Basic HTML companion curriculum
- Student login with **username + password** only
- Teacher login with Firebase email/password
- Teacher-controlled student CRUD — no public student signup
- Searchable, online-first teacher roster with calm professional UI
- Cloud lesson progress and test attempt history
- Realtime live code monitoring with ~750 ms debounce
- Live lesson/stage/test status and 20-second presence heartbeat
- Firebase Admin protected teacher APIs
- Firestore security rules
- Local-only fallback when Firebase public config is absent

## Experience

### Student

- username/password sign-in with no visible email field
- one clear continue action
- five weekly outcomes and an eight-week visual route
- original Practice → Challenge → Mini Build flow
- dark CodeMirror workspace with a high-contrast caret
- Fit, Desktop, Tablet, and Mobile preview presets
- accessible test feedback and cloud completion

### Teacher

- email/password protected console
- student create, edit, password reset, active/inactive, progress reset, and delete
- realtime lesson, stage, presence, test count, and live code
- read-only CodeMirror monitoring without screen, camera, or microphone access

See [`docs/UI_SYSTEM.md`](./docs/UI_SYSTEM.md) for design tokens, responsive behavior, motion, and accessibility rules.

## Local install

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Firebase values, the curriculum still runs in local mode and lesson completion is stored in `localStorage`. Teacher features require Firebase.

## Firebase setup

### 1. Create the Firebase project

Create a Firebase project, then add a **Web App**. Copy its web config values into `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 2. Enable Authentication

In Firebase Console → Authentication → Sign-in method, enable **Email/Password**.

Students never see an email field. A username such as `ege_01` is mapped internally to an auth-only address such as `ege_01@students.urtimur.local`.

### 3. Create Firestore

Create a Cloud Firestore database. Production mode is fine because this repository includes least-privilege rules in `firestore.rules`.

Deploy them with Firebase CLI:

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules --project YOUR_PROJECT_ID
```

You can also paste `firestore.rules` into the Firebase Console Rules editor.

### 4. Add Firebase Admin credentials

Firebase Console → Project Settings → Service Accounts → Generate new private key.

Copy these values from the downloaded service-account JSON into `.env.local`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Never commit `.env.local` or the service-account JSON.

### 5. Bootstrap the first teacher

Create your teacher user once in Firebase Console → Authentication → Users using your real email and a password.

Then grant the custom teacher claim:

```bash
npm run firebase:set-teacher -- your-email@example.com
```

If that teacher was already signed in, sign out and sign in again so the refreshed ID token contains `role: teacher`.

### 6. Open the teacher console

- Student app: `/`
- Student login: `/login`
- Teacher login: `/teacher/login`
- Teacher console: `/teacher`

From the teacher console you can:

- create students
- edit name and username
- change passwords
- activate/deactivate accounts
- reset course progress
- delete students
- see completed lessons and latest test scores
- watch the selected student's code live in a read-only CodeMirror editor

## Firestore model

```text
students/{uid}
  name
  username
  active
  createdAt
  updatedAt

students/{uid}/progress/{lessonId}
  lessonId
  completed
  completedAt
  attempts
  lastPassedCount
  totalTests
  lastAttemptAt
  updatedAt

liveSessions/{uid}
  studentId
  lessonId
  weekId
  taskId
  code
  passedCount
  totalTests
  status
  lastAction
  updatedAt
```

Passwords are stored only by Firebase Authentication and are never written to Firestore.

## Live monitoring behavior

While a student has a lesson open:

- editor changes sync after roughly **750 ms** of inactivity
- a heartbeat updates every **20 seconds**
- teacher UI considers the student online when the latest live update is under ~45 seconds old
- running lesson tests immediately updates the live test state
- leaving the lesson attempts to mark the live session idle

The teacher receives the student's Code Lab editor content only. This is not desktop, camera, microphone, or screen surveillance.

## Vercel

Add all variables from `.env.local` to Vercel Project Settings → Environment Variables. The six `NEXT_PUBLIC_` values are browser config; the three `FIREBASE_` Admin values are server-only.

Then deploy normally.

## Commands

```bash
npm run dev
npm test
npm run lint
npm run build
npm run firebase:set-teacher -- your-email@example.com
```

## Curriculum

See [`CURRICULUM.md`](./CURRICULUM.md) for the current FCC-aligned eight-week Basic HTML plan. The FCC sequence and learning outcomes are covered, while Code Lab scenarios, instructions, tests, and builds remain original.

## UI architecture

The main presentation units are intentionally separated from Firebase and curriculum data:

```text
src/components/
  code-buddy-illustration.tsx
  circular-progress.tsx
  learning-sticker.tsx
  ui/

src/features/curriculum/components/
  continue-learning-card.tsx
  week-journey-card.tsx
  week-detail-panel.tsx

src/features/lesson-runner/components/
  mission-stage-card.tsx
  workspace-status.tsx
  code-editor.tsx
  live-preview.tsx

src/features/teacher/
  teacher-dashboard.tsx
```

## Verification note

`npm test`, `npm run lint`, and `npm run build` require installed dependencies. The repository also includes a dependency-free semantic design contract:

```bash
npm run test:design
```
