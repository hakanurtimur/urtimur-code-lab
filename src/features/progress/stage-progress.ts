import type { LessonTest } from "@/features/curriculum/types";

export type LessonStageKey = "practice" | "challenge" | "mini";

export type LessonStageProgress = {
  practiceCompleted: boolean;
  challengeCompleted: boolean;
  miniCompleted: boolean;
  currentStage: LessonStageKey;
};

export const EMPTY_STAGE_PROGRESS: LessonStageProgress = {
  practiceCompleted: false,
  challengeCompleted: false,
  miniCompleted: false,
  currentStage: "practice",
};

export function stageTests(tests: LessonTest[], stage: LessonStageKey): LessonTest[] {
  if (tests.length <= 1 || stage === "mini") return tests;
  const ratio = stage === "practice" ? 1 / 3 : 2 / 3;
  const count = Math.max(1, Math.ceil(tests.length * ratio));
  return tests.slice(0, count);
}

export function canOpenStage(progress: LessonStageProgress, stage: LessonStageKey) {
  if (stage === "practice") return true;
  if (stage === "challenge") return progress.practiceCompleted;
  return progress.practiceCompleted && progress.challengeCompleted;
}

export function markStageComplete(
  progress: LessonStageProgress,
  stage: LessonStageKey,
): LessonStageProgress {
  if (stage === "practice") {
    return { ...progress, practiceCompleted: true, currentStage: "challenge" };
  }
  if (stage === "challenge") {
    return { ...progress, practiceCompleted: true, challengeCompleted: true, currentStage: "mini" };
  }
  return {
    practiceCompleted: true,
    challengeCompleted: true,
    miniCompleted: true,
    currentStage: "mini",
  };
}
