import { describe, expect, it } from "vitest";
import { basicHtmlModule } from "./data/basic-html";
import { getLessonCompletionHandoff, getLessonNavigation } from "./lesson-navigation";

describe("getLessonNavigation", () => {
  it("derives previous and next lessons inside the current week", () => {
    const week = basicHtmlModule.weeks[0];
    const navigation = getLessonNavigation(week.lessons[1], basicHtmlModule.weeks);

    expect(navigation.currentIndex).toBe(1);
    expect(navigation.totalInWeek).toBe(3);
    expect(navigation.previousLesson?.id).toBe(week.lessons[0].id);
    expect(navigation.nextLesson?.id).toBe(week.lessons[2].id);
    expect(navigation.isLastLessonInWeek).toBe(false);
  });

  it("returns the next week for the final lesson", () => {
    const week = basicHtmlModule.weeks[0];
    const navigation = getLessonNavigation(week.lessons.at(-1)!, basicHtmlModule.weeks);

    expect(navigation.nextLesson).toBeNull();
    expect(navigation.isLastLessonInWeek).toBe(true);
    expect(navigation.nextWeek?.id).toBe(basicHtmlModule.weeks[1].id);
  });

  it("recommends the first remaining lesson when a student finishes out of order", () => {
    const week = basicHtmlModule.weeks[0];
    const handoff = getLessonCompletionHandoff(
      week.lessons[2],
      basicHtmlModule.weeks,
      [],
      1,
    );

    expect(handoff.weekComplete).toBe(false);
    expect(handoff.nextLesson?.id).toBe(week.lessons[0].id);
    expect(handoff.nextLessonStartsNewWeek).toBe(false);
  });

  it("does not describe a return to an earlier unfinished week as a new week", () => {
    const secondWeek = basicHtmlModule.weeks[1];
    const handoff = getLessonCompletionHandoff(
      secondWeek.lessons[0],
      basicHtmlModule.weeks,
      [],
      2,
    );

    expect(handoff.nextLesson?.weekId).toBe(basicHtmlModule.weeks[0].id);
    expect(handoff.nextLessonStartsNewWeek).toBe(false);
  });

  it("treats the final remaining lesson as a completed week even when it is not last in order", () => {
    const firstWeek = basicHtmlModule.weeks[0];
    const secondWeek = basicHtmlModule.weeks[1];
    const handoff = getLessonCompletionHandoff(
      firstWeek.lessons[0],
      basicHtmlModule.weeks,
      firstWeek.lessons.slice(1).map((lesson) => lesson.id),
      2,
    );

    expect(handoff.weekComplete).toBe(true);
    expect(handoff.nextLesson?.id).toBe(secondWeek.lessons[0].id);
    expect(handoff.nextLessonStartsNewWeek).toBe(true);
  });

  it("waits for teacher unlock after completing every lesson in the current unlocked week", () => {
    const week = basicHtmlModule.weeks[0];
    const handoff = getLessonCompletionHandoff(
      week.lessons[2],
      basicHtmlModule.weeks,
      week.lessons.slice(0, 2).map((lesson) => lesson.id),
      1,
    );

    expect(handoff.weekComplete).toBe(true);
    expect(handoff.nextWeek?.id).toBe(basicHtmlModule.weeks[1].id);
    expect(handoff.nextWeekUnlocked).toBe(false);
    expect(handoff.nextLesson).toBeNull();
  });

});
