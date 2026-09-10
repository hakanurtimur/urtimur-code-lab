import { basicHtmlModule } from "./data/basic-html";
import type { CurriculumModule, CurriculumWeek, Lesson } from "./types";

export const curriculumModules: CurriculumModule[] = [basicHtmlModule];

export function getTotalCurriculumWeeks(): number {
  return curriculumModules.reduce((total, module) => total + module.weeks.length, 0);
}

export function getAllLessons(): Lesson[] {
  return curriculumModules.flatMap((module) =>
    module.weeks.flatMap((week) => week.lessons),
  );
}

export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find((lesson) => lesson.id === id);
}

export function getWeekById(id: string): CurriculumWeek | undefined {
  return curriculumModules.flatMap((module) => module.weeks).find((week) => week.id === id);
}

export function getWeekForLesson(lesson: Lesson): CurriculumWeek | undefined {
  return getWeekById(lesson.weekId);
}
