import type { LiveActivePane, PreviewPreset } from "@/features/live-session/types";

export type StudentRecord = {
  id: string;
  name: string;
  username: string;
  active: boolean;
  maxUnlockedWeekOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type StudentProgressItem = {
  lessonId: string;
  completed: boolean;
  currentStage: "practice" | "challenge" | "mini";
  practiceCompleted: boolean;
  challengeCompleted: boolean;
  miniCompleted: boolean;
  attempts: number;
  lastPassedCount: number;
  totalTests: number;
  updatedAtMs: number | null;
  completedAtMs: number | null;
};

export type LiveSessionStatus = "coding" | "testing" | "active" | "idle";

export type LiveSessionRecord = {
  studentId: string;
  lessonId: string | null;
  weekId: string | null;
  taskId: string | null;
  code: string;
  passedCount: number;
  totalTests: number;
  status: LiveSessionStatus;
  lastAction: string;
  activePane: LiveActivePane;
  previewPreset: PreviewPreset;
  previewScrollY: number;
  previewUpdatedAtMs: number | null;
  updatedAtMs: number | null;
};
