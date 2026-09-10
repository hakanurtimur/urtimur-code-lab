# Playful Learning UI Design

## Goal

Transform Hakan Urtimur Code Lab from a functional developer-tool interface into a premium, child-friendly learning product while preserving the serious code editor, Firebase authentication, progress tracking, live session sync, and teacher CRUD workflows.

## Audience

The primary learner is a bright 13-year-old. The interface should feel energetic, contemporary, and inviting without looking preschool-oriented. Visual references are soft educational applications with pastel surfaces, rounded cards, friendly 3D-like illustration, clear progress feedback, and simple task hierarchy.

## Product principles

1. **One clear next action.** The student should immediately see where to continue.
2. **Warm, not childish.** Use playful shapes and illustrations while keeping language and code tooling mature.
3. **Progress without pressure.** Show completed lessons and weekly goals without XP, streak anxiety, timers, or leaderboards.
4. **Serious workspace.** The code editor remains dark, high-contrast, keyboard-friendly, and visually separated from the playful learning shell.
5. **Purposeful motion.** Motion explains hierarchy and feedback; it never competes with typing.
6. **Accessible by default.** Strong focus states, non-color-only status, 44px targets, keyboard navigation, and reduced-motion support.
7. **Teacher clarity.** Teacher surfaces use the same brand family with calmer colors and higher information density.

## Visual language

### Palette

- Canvas: soft cloud lavender and warm off-white.
- Ink: near-black navy.
- Primary: saturated violet.
- Secondary accents: sky blue, peach, mint, and soft pink.
- Editor: deep navy with vivid but restrained syntax and caret contrast.
- Status: mint green for success, amber for attention, coral for destructive actions.

### Shape and depth

- Primary cards use 24–32px radii.
- Small controls use 12–18px radii.
- Borders are low-contrast lavender-gray.
- Shadows are soft, broad, and low-opacity; no glassmorphism.
- Decorative blobs and orbit shapes are non-interactive and aria-hidden.

### Type

- Use a rounded system-first display stack for student headings and a neutral system sans for body copy.
- Preserve a true monospace stack in the editor and technical labels.
- Student headings can be bold and compact; body copy remains short and readable.

## Student authentication

The student login uses a two-panel layout on desktop and a single stacked card on mobile.

- Left visual panel: Code Lab brand, original Code Buddy illustration, short welcome copy, floating topic chips.
- Right login card: username, password, one primary CTA, cloud-progress assurance, discreet teacher link.
- No email is shown to students.
- Local mode still has a deliberate, branded fallback state.

## Student dashboard

### Header

- Brand lockup.
- Compact student identity pill and sign-out action.
- Current curriculum badge.

### Hero / continue card

- Personalized greeting when a display name exists.
- Current week, current lesson, FCC step range, and one primary “continue” CTA.
- Large original Code Buddy illustration.
- Circular curriculum progress and a compact current-week progress indicator.

### Weekly outcomes

- A dedicated “this week” card shows the five weekly outcomes.
- Outcomes are short and visually scannable.

### Learning route

- Eight weeks appear as responsive lesson cards instead of a long accordion list.
- Each card has: order, theme, FCC status, companion completion, progress ring, lesson count, and state-specific CTA.
- Selecting a week reveals a focused detail panel containing FCC blocks, five weekly outcomes, and original companion lessons.
- Upcoming FCC weeks remain visible but visually restrained.

### Supporting cards

- Compact cards explain the Learn → Practice → Build cycle and cloud saving.
- No XP, levels, streaks, confetti, or competitive elements.

## Lesson workspace

### Responsive structure

- Wide desktop: mission panel + code editor + preview/results.
- Medium desktop/tablet: mission panel plus switchable code/preview workspace.
- Mobile: three large tabs—Mission, Code, Result.

### Mission panel

- Week/theme card.
- Stage switcher for Practice, Challenge, Mini Build.
- Requirements shown first.
- FCC checkpoint, five outcomes, quick recall, and hints are progressively disclosed.
- Only one primary action is visible at a time.

### Code editor

- Dark IDE surface with visible 2px caret.
- File tab, reset action, sync status, and keyboard-friendly controls.
- Editor height tracks viewport without hiding action buttons.

### Preview

- Device presets: Fit, Desktop, Tablet, Mobile.
- Preview has a responsive stage, visible dimensions, and enough vertical space to be useful.
- The selected real viewport is scaled to fit while preserving CSS breakpoints.

### Tests

- Test summary is visible without scrolling past the entire preview.
- Passing and failing states include icon and text.
- Completion uses a restrained spring/pulse and clear save state.

## Teacher experience

### Teacher login

- Calm, compact, professional card.
- Same brand system, reduced illustration and softer motion.

### Teacher dashboard

- Top summary: student count, online count, active accounts, live sessions.
- Roster includes search and online-first sorting.
- Selected student opens a command-center layout:
  - status, current lesson, current stage, last seen,
  - read-only live CodeMirror editor,
  - live test score,
  - curriculum progress,
  - recent lesson activity,
  - account CRUD controls.
- Destructive actions are visually isolated and require a second confirmation.

## Components

New or revised components:

- `CodeBuddyIllustration`
- `LearningSticker`
- `CircularProgress`
- `StudentShellHeader`
- `ContinueLearningCard`
- `WeeklyOutcomeCard`
- `WeekJourneyCard`
- `WeekDetailPanel`
- `MissionStageCard`
- `WorkspaceStatus`
- `TeacherStatCard`
- `StudentRosterItem`

Components must remain data-driven and must not duplicate curriculum content.

## Motion

- Page/card entrance: 180–320ms opacity + small translate.
- Card hover: 1–3px lift only on pointer devices.
- Progress ring: animate from 0 to current value.
- Test success: one short spring pulse.
- Online indicator: subtle opacity pulse.
- All non-essential motion disabled under `prefers-reduced-motion: reduce`.

## Data and backend boundaries

- No Firestore schema changes are required for the visual redesign.
- Existing auth, student CRUD, progress, and live-session hooks remain the source of truth.
- UI reads display name from Firebase Auth where available.
- Curriculum remains in source-controlled TypeScript data.

## Acceptance criteria

- Student login, dashboard, and lesson workspace share a coherent playful visual language.
- Teacher screens share the brand but remain calmer and denser.
- All existing Firebase and curriculum behavior is preserved.
- Caret is visible in the editor.
- Preview presets remain correct and usable.
- Student dashboard exposes exactly one obvious continue action.
- Week cards and selected week detail are keyboard accessible.
- Mobile layouts do not squeeze three columns.
- Reduced-motion mode removes non-essential transitions.
- Existing tests are updated, and new design contract tests cover key semantic structure.
