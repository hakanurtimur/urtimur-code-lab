import { describe, expect, it } from "vitest";
import { basicHtmlModule } from "./data/basic-html";
import { deriveLearningPathState } from "./learning-path-state";

describe("deriveLearningPathState", () => {
  it("marks the first incomplete lesson in unlocked weeks as current", () => {
    const firstWeek = basicHtmlModule.weeks[0];
    const secondWeek = basicHtmlModule.weeks[1];
    const completedIds = firstWeek.lessons.map((lesson) => lesson.id);

    const state = deriveLearningPathState(basicHtmlModule.weeks, completedIds, 2);

    expect(state.currentLesson?.id).toBe(secondWeek.lessons[0].id);
    expect(state.weeks[0].state).toBe("completed");
    expect(state.weeks[1].state).toBe("current");
    expect(state.weeks[1].lessons.map((item) => item.state)).toEqual([
      "current",
      "available",
      "available",
    ]);
  });

  it("keeps future weeks and their lessons locked", () => {
    const state = deriveLearningPathState(basicHtmlModule.weeks, [], 1);

    expect(state.weeks[0].lessons[0].state).toBe("current");
    expect(state.weeks[1].state).toBe("locked");
    expect(state.weeks[1].lessons.every((item) => item.state === "locked")).toBe(true);
  });

  it("allows completed lessons to stay reopenable without becoming current", () => {
    const week = basicHtmlModule.weeks[0];
    const state = deriveLearningPathState(basicHtmlModule.weeks, [week.lessons[0].id], 1);

    expect(state.weeks[0].lessons[0].state).toBe("completed");
    expect(state.currentLesson?.id).toBe(week.lessons[1].id);
  });
});
