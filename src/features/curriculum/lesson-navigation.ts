import type { CurriculumWeek, Lesson } from "./types";

export type LessonNavigation = {
  currentIndex: number;
  totalInWeek: number;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
  isLastLessonInWeek: boolean;
  nextWeek: CurriculumWeek | null;
};

export type LessonCompletionHandoff = {
  weekComplete: boolean;
  curriculumComplete: boolean;
  nextLesson: Lesson | null;
  nextLessonStartsNewWeek: boolean;
  nextWeek: CurriculumWeek | null;
  nextWeekUnlocked: boolean;
};

export function getLessonNavigation(
  lesson: Lesson,
  weeks: CurriculumWeek[],
): LessonNavigation {
  const weekIndex = weeks.findIndex((week) => week.id === lesson.weekId);
  const week = weekIndex >= 0 ? weeks[weekIndex] : undefined;
  const currentIndex = week?.lessons.findIndex((item) => item.id === lesson.id) ?? -1;
  const totalInWeek = week?.lessons.length ?? 0;
  const previousLesson = currentIndex > 0 ? week?.lessons[currentIndex - 1] ?? null : null;
  const nextLesson = currentIndex >= 0 && currentIndex < totalInWeek - 1
    ? week?.lessons[currentIndex + 1] ?? null
    : null;
  const isLastLessonInWeek = currentIndex >= 0 && currentIndex === totalInWeek - 1;
  const nextWeek = weekIndex >= 0 ? weeks[weekIndex + 1] ?? null : null;

  return {
    currentIndex,
    totalInWeek,
    previousLesson,
    nextLesson,
    isLastLessonInWeek,
    nextWeek,
  };
}

export function getLessonCompletionHandoff(
  lesson: Lesson,
  weeks: CurriculumWeek[],
  completedLessonIds: string[],
  maxUnlockedWeekOrder: number,
): LessonCompletionHandoff {
  const completedIds = new Set(completedLessonIds);
  completedIds.add(lesson.id);

  const weekIndex = weeks.findIndex((week) => week.id === lesson.weekId);
  const currentWeek = weekIndex >= 0 ? weeks[weekIndex] : null;
  const nextWeek = weekIndex >= 0 ? weeks[weekIndex + 1] ?? null : null;
  const nextWeekUnlocked = Boolean(nextWeek && nextWeek.order <= maxUnlockedWeekOrder);
  const weekComplete = Boolean(
    currentWeek && currentWeek.lessons.every((item) => completedIds.has(item.id)),
  );
  const curriculumComplete = weeks.every((week) =>
    week.lessons.every((item) => completedIds.has(item.id)),
  );

  const nextLesson = weeks
    .filter((week) => week.order <= maxUnlockedWeekOrder)
    .flatMap((week) => week.lessons)
    .find((item) => !completedIds.has(item.id)) ?? null;
  const nextLessonWeek = nextLesson
    ? weeks.find((week) => week.id === nextLesson.weekId) ?? null
    : null;

  return {
    weekComplete,
    curriculumComplete,
    nextLesson,
    nextLessonStartsNewWeek: Boolean(
      currentWeek && nextLessonWeek && nextLessonWeek.order > currentWeek.order,
    ),
    nextWeek,
    nextWeekUnlocked,
  };
}
