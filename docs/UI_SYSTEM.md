# Hakan Urtimur Code Lab UI System

This document describes the visual and interaction rules for the student and teacher surfaces. The goal is a warm, premium learning product for a bright 13-year-old: playful enough to invite exploration, mature enough to make the code editor feel real.

## Product split

### Student surface

The student experience uses pastel learning cards, rounded geometry, original Code Buddy artwork, short instructions, and clear progress feedback. It deliberately avoids XP, streaks, leaderboards, countdowns, and confetti.

Core routes:

- `/login` — username/password student sign-in
- `/` — curriculum dashboard and eight-week route
- `/lesson/[lessonId]` — mission, code, preview, tests, and completion

### Teacher surface

The teacher experience uses the same brand and tokens with a calmer, denser layout. It prioritizes realtime classroom information, read-only live code, progress, search, and student CRUD.

Core routes:

- `/teacher/login` — teacher email/password sign-in
- `/teacher` — live classroom command center

## Design tokens

The canonical tokens live in `src/app/globals.css`.

| Token | Purpose |
| --- | --- |
| `--cloud` / `--background` | Student canvas and neutral app background |
| `--paper` / `--card` | High-contrast reading and form surfaces |
| `--ink` | Main text and strong controls |
| `--violet` | Brand and primary action |
| `--lavender` | Selected states and learning surfaces |
| `--sky` | Information and practice content |
| `--peach` | Warm calls to action and build content |
| `--mint` | Completion, cloud sync, and online state |
| `--pink` / `--yellow` | Supporting learning categories |
| `--code` | CodeMirror workspace |
| `--danger` | Destructive teacher actions |

Primary cards use 24–32px radii. Controls use 12–18px radii. Shadows are broad and low-opacity rather than glossy or glass-heavy.

## Typography

- Student display headings use a rounded system-first stack.
- Body copy uses a neutral system sans stack.
- Technical labels use a monospace stack.
- CodeMirror always uses a true monospace stack.
- Instructions should be short, concrete, and result-oriented.

Prefer:

> Robotun fotoğrafını erişilebilir şekilde sayfaya ekle.

Avoid:

> Bir `img` elementi oluştur ve `alt` attribute ekle.

The second version may be used as a hint, not as the main challenge instruction.

## Student dashboard structure

1. Header with brand, curriculum indicator, student identity, and sign-out.
2. A single prominent continue card.
3. Five outcomes for the active week.
4. Learn → Practice → Build explanation.
5. Eight selectable week cards.
6. Focused selected-week detail with FCC blocks, outcomes, and original Code Lab lessons.
7. Supporting cards for cloud save, progressive independence, and outcome-based pacing.

The dashboard must expose only one visually dominant continue action.

## Lesson workspace

### Wide screens — 1440px and above

All three panes remain visible:

- mission
- code
- result

### Medium screens — 1024px to 1439px

The mission pane remains visible. Code and result share the second column and are switched with the pane navigation.

### Small screens — below 1024px

Only one pane is visible at a time. The sticky pane navigation exposes Mission, Code, and Result as large touch targets.

### Mission pane

- Week and theme summary
- FCC checkpoint
- Practice / Challenge / Mini Build tabs
- Requirements first
- Five lesson outcomes in a disclosure
- Quick recall in a disclosure

### Code pane

- File tab and reset action
- Cloud/local sync indicator
- High-contrast CodeMirror surface
- Visible 2px yellow caret
- One primary “Kodumu kontrol et” action

### Result pane

- Fit, Desktop, Tablet, and Mobile presets
- Real viewport dimensions preserved before scaling
- Test summary visible near the preview
- Icon + text for pass/fail states
- Restrained completion spring and explicit cloud/local save state

## Motion rules

Motion uses `motion/react` and CSS transitions.

- Page/card entrance: 180–340ms fade plus small translate.
- Selected cards: 1–3px lift on pointer devices.
- Progress: smooth fill/ring transition.
- Test results: short staggered reveal.
- Completion: one short spring.
- Online status: subtle opacity pulse.
- Preview does not animate while the student types.

All non-essential animation is effectively removed under `prefers-reduced-motion: reduce`.

## Accessibility rules

- Controls should target at least 44px where layout permits.
- Every icon-only action requires an accessible name.
- Status never relies on color alone.
- Student week cards are real buttons with `aria-pressed` and `aria-controls`.
- Test summaries use `role="status"` and polite live announcements.
- Form errors use `role="alert"`.
- The preview iframe has a title and a sandbox.
- The teacher live editor is read-only and clearly labeled.
- Keyboard focus must remain visible on all interactive elements.

## Illustration rules

`CodeBuddyIllustration` is original inline SVG artwork and has three moods:

- `wave`
- `focus`
- `celebrate`

`LearningSticker` provides compact, toy-like depth for icons without requiring third-party assets. Illustrations should support the task hierarchy rather than fill every empty space.

## Teacher command center

The teacher dashboard contains:

- class summary cards
- searchable, online-first roster
- selected student status and current lesson
- read-only live CodeMirror view
- current stage, last action, and live test count
- Basic HTML completion
- recent lesson activity
- student name/username/password/active-state controls
- progress reset and two-step delete confirmation

Destructive actions remain visually isolated from the normal save action.

## Data boundaries

The UI redesign does not change:

- Firestore document paths
- Firebase authentication strategy
- student CRUD API shape
- lesson progress shape
- live session shape
- curriculum TypeScript data

Design components consume the existing hooks and data models rather than duplicating content.
