import { describe, expect, it } from "vitest";
import type { LessonTest } from "@/features/curriculum/types";
import { canOpenStage, EMPTY_STAGE_PROGRESS, markStageComplete, stageTests } from "./stage-progress";

const tests = Array.from({ length: 4 }, (_, index) => ({
  id: `t${index}`,
  label: `T${index}`,
  kind: "selector" as const,
  selector: `x${index}`,
})) satisfies LessonTest[];

describe("stage progression", () => {
  it("uses progressively larger test slices", () => {
    expect(stageTests(tests, "practice")).toHaveLength(2);
    expect(stageTests(tests, "challenge")).toHaveLength(3);
    expect(stageTests(tests, "mini")).toHaveLength(4);
  });

  it("unlocks challenge then mini in order", () => {
    expect(canOpenStage(EMPTY_STAGE_PROGRESS, "challenge")).toBe(false);
    const afterPractice = markStageComplete(EMPTY_STAGE_PROGRESS, "practice");
    expect(canOpenStage(afterPractice, "challenge")).toBe(true);
    expect(canOpenStage(afterPractice, "mini")).toBe(false);
    const afterChallenge = markStageComplete(afterPractice, "challenge");
    expect(canOpenStage(afterChallenge, "mini")).toBe(true);
  });
});
