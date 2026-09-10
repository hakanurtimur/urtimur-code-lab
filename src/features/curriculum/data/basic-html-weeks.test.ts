import { describe, expect, it } from "vitest";
import { basicHtmlModule } from "./basic-html";

describe("Basic HTML weekly curriculum", () => {
  it("maps all 137 FCC Basic HTML steps continuously into eight weeks", () => {
    expect(basicHtmlModule.weeks).toHaveLength(8);

    let expectedStart = 1;
    for (const week of basicHtmlModule.weeks) {
      expect(week.fccSteps.start).toBe(expectedStart);
      expect(week.fccSteps.end).toBeGreaterThanOrEqual(week.fccSteps.start);
      expect(week.fccSteps.total).toBe(137);
      expectedStart = week.fccSteps.end + 1;
    }

    expect(expectedStart).toBe(138);
  });

  it("keeps week 1 as the completed FCC checkpoint and week 2 as current", () => {
    expect(basicHtmlModule.weeks[0].fccStatus).toBe("completed");
    expect(basicHtmlModule.weeks[1].fccStatus).toBe("current");
    expect(basicHtmlModule.weeks.slice(2).every((week) => week.fccStatus === "upcoming")).toBe(true);
  });

  it("defines exactly five weekly outcomes for every week", () => {
    for (const week of basicHtmlModule.weeks) {
      expect(week.outcomes, week.title).toHaveLength(5);
    }
  });

  it("defines three original companion lessons and five outcomes per lesson", () => {
    const lessons = basicHtmlModule.weeks.flatMap((week) => week.lessons);

    expect(lessons).toHaveLength(24);
    expect(basicHtmlModule.weeks.every((week) => week.lessons.length === 3)).toBe(true);

    for (const lesson of lessons) {
      expect(lesson.outcomes, lesson.title).toHaveLength(5);
      expect(lesson.quickRecall, lesson.title).toHaveLength(3);
      expect(lesson.practice.requirements.length, lesson.title).toBeGreaterThan(0);
      expect(lesson.challenge.requirements.length, lesson.title).toBeGreaterThan(0);
      expect(lesson.miniBuild.requirements.length, lesson.title).toBeGreaterThan(0);
      expect(lesson.tests.length, lesson.title).toBeGreaterThan(0);
    }
  });

  it("uses unique week and lesson ids", () => {
    const weekIds = basicHtmlModule.weeks.map((week) => week.id);
    const lessons = basicHtmlModule.weeks.flatMap((week) => week.lessons);
    const lessonIds = lessons.map((lesson) => lesson.id);

    expect(new Set(weekIds).size).toBe(weekIds.length);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
  });

  it("tracks the FCC block sequence while keeping companion project titles original", () => {
    const blocks = basicHtmlModule.weeks.flatMap((week) => week.fccBlocks.map((block) => block.title));
    const companionTitles = basicHtmlModule.weeks.flatMap((week) => week.lessons.map((lesson) => lesson.title));

    expect(blocks[0]).toBe("Build a Curriculum Outline");
    expect(blocks).toContain("Build a Cat Photo App");
    expect(blocks).toContain("Build a Recipe Page");
    expect(blocks).toContain("Build an HTML Video Player");
    expect(blocks).toContain("Build a Video Display Using iframe");
    expect(blocks.at(-1)).toBe("Basic HTML Quiz");

    expect(companionTitles).not.toContain("Build a Cat Photo App");
    expect(companionTitles).not.toContain("Build a Recipe Page");
    expect(companionTitles).not.toContain("Build an HTML Video Player");
  });
});
