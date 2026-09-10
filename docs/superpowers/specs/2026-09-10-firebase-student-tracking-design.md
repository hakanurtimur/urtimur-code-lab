# Firebase Student Tracking Design

## Goal
Add cloud-backed student progress, teacher-managed student accounts, and live read-only code monitoring without adding public signup or student email UX.

## Authentication
- Teachers sign in with Firebase Authentication email/password.
- Students sign in with a username/password form.
- Student usernames are normalized and converted internally to `<username>@students.urtimur.local` for Firebase Auth. The synthetic email is never shown to students.
- There is no public signup.
- Teacher authorization uses Firebase custom claim `role: "teacher"`.

## Teacher management
Teacher CRUD calls protected Next.js route handlers. Each request includes a Firebase ID token; Firebase Admin verifies it and requires the teacher claim.

Teachers can create, rename, activate/deactivate, reset passwords, reset progress, and delete students.

## Firestore model
- `students/{uid}`: `name`, `username`, `active`, `createdAt`, `updatedAt`.
- `students/{uid}/progress/{lessonId}`: completion and latest test metadata.
- `liveSessions/{uid}`: current lesson/task, code snapshot, test summary, status, `updatedAt`.

## Realtime behavior
Student code is synced with a 750 ms debounce. A 20-second heartbeat refreshes the live session while the lesson workspace is open. Teacher views use Firestore listeners and render the selected student's code in a read-only CodeMirror editor.

## Security
- Students may read their own profile, read/write their own progress, and read/write their own live session.
- Teachers with `role == "teacher"` may read student/progress/live data.
- Student account CRUD is performed only by Firebase Admin server routes.
- Passwords are never stored in Firestore.

## Offline behavior
Curriculum remains code-backed. If Firebase public configuration is missing, the app keeps local progress behavior and clearly reports cloud features as unavailable. When Firebase is configured, authenticated student progress is cloud-first.
