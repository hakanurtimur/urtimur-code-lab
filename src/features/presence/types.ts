export type StudentPresence = {
  studentId: string;
  online: boolean;
  currentPath: string;
  currentLessonId: string | null;
  visibility: "visible" | "hidden";
  lastSeenMs: number | null;
};
