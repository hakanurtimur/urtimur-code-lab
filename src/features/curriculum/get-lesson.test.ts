import { describe, expect, it } from "vitest";
import {
  curriculumModules,
  getAllLessons,
  getLessonById,
  getWeekForLesson,
} from "./get-lesson";

describe("Responsive Web Design curriculum", () => {
  it("ships Basic HTML as eight weeks covering 137 FCC steps", () => {
    const basicHtml = curriculumModules.find((module) => module.id === "basic-html");

    expect(basicHtml).toBeDefined();
    expect(basicHtml?.weeks).toHaveLength(8);
    expect(basicHtml?.totalFccSteps).toBe(137);
  });

  it("ships three original companion lessons per week", () => {
    const basicHtml = curriculumModules.find((module) => module.id === "basic-html");

    expect(basicHtml?.weeks.every((week) => week.lessons.length === 3)).toBe(true);
    expect(getAllLessons()).toHaveLength(24);
  });

  it("gives every companion lesson exactly five learning outcomes", () => {
    expect(getAllLessons().every((lesson) => lesson.outcomes.length === 5)).toBe(true);
  });

  it("returns the first week debugging lesson and its week", () => {
    const lesson = getLessonById("w1-robot-profile-debug");

    expect(lesson?.title).toBe("Arızalı Robot Profili");
    expect(lesson?.weekOrder).toBe(1);
    expect(lesson?.outcomes).toHaveLength(5);
    expect(lesson ? getWeekForLesson(lesson)?.theme : undefined).toBe("Arızalı Robot Profili");
  });

  it("returns the Basic HTML final build", () => {
    const lesson = getLessonById("basic-html-final-tech-club");

    expect(lesson?.title).toBe("Final Build · Kendi Teknoloji Kulübün");
    expect(lesson?.weekOrder).toBe(8);
    expect(lesson?.starterCode).toBe("");
  });

  it("returns undefined for an unknown lesson", () => {
    expect(getLessonById("does-not-exist")).toBeUndefined();
  });
});
