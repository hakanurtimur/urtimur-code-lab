import type { CurriculumWeek, Lesson } from "./types";

export type LearningPathLessonStatus = "completed" | "current" | "available" | "locked";
export type LearningPathWeekStatus = "completed" | "current" | "available" | "locked";

export type LearningPathLessonState = {
  lesson: Lesson;
  state: LearningPathLessonStatus;
};

export type LearningPathWeekState = {
  week: CurriculumWeek;
  state: LearningPathWeekStatus;
  lessons: LearningPathLessonState[];
  completedLessons: number;
  percent: number;
};

export type LearningPathState = {
  weeks: LearningPathWeekState[];
  currentLesson: Lesson | null;
  currentWeek: CurriculumWeek | null;
  maxUnlockedWeekOrder: number;
};

function clampUnlockedWeekOrder(value: number, weeks: CurriculumWeek[]) {
  if (!weeks.length) return 0;
  if (!Number.isFinite(value)) return 1;
  return Math.min(weeks.length, Math.max(1, Math.trunc(value)));
}

export function deriveLearningPathState(
  weeks: CurriculumWeek[],
  completedLessonIds: string[],
  maxUnlockedWeekOrder: number,
): LearningPathState {
  const completedIds = new Set(completedLessonIds);
  const unlockedWeekOrder = clampUnlockedWeekOrder(maxUnlockedWeekOrder, weeks);
  const currentLesson =
    weeks
      .filter((week) => week.order <= unlockedWeekOrder)
      .flatMap((week) => week.lessons)
      .find((lesson) => !completedIds.has(lesson.id)) ?? null;

  const currentWeek = currentLesson
    ? weeks.find((week) => week.id === currentLesson.weekId) ?? null
    : null;

  const pathWeeks = weeks.map<LearningPathWeekState>((week) => {
    const locked = week.order > unlockedWeekOrder;
    const completedLessons = week.lessons.filter((lesson) => completedIds.has(lesson.id)).length;
    const allComplete = week.lessons.length > 0 && completedLessons === week.lessons.length;
    const percent = week.lessons.length
      ? Math.round((completedLessons / week.lessons.length) * 100)
      : 0;

    const lessons = week.lessons.map<LearningPathLessonState>((lesson) => {
      if (locked) return { lesson, state: "locked" };
      if (completedIds.has(lesson.id)) return { lesson, state: "completed" };
      if (currentLesson?.id === lesson.id) return { lesson, state: "current" };
      return { lesson, state: "available" };
    });

    const state: LearningPathWeekStatus = locked
      ? "locked"
      : allComplete
        ? "completed"
        : currentWeek?.id === week.id
          ? "current"
          : "available";

    return {
      week,
      state,
      lessons,
      completedLessons,
      percent,
    };
  });

  return {
    weeks: pathWeeks,
    currentLesson,
    currentWeek,
    maxUnlockedWeekOrder: unlockedWeekOrder,
  };
}
