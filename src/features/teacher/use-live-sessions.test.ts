import { describe, expect, it } from "vitest";
import { parseSession } from "./use-live-sessions";

describe("parseSession", () => {
  it("parses synchronized browser and workspace state", () => {
    expect(parseSession("student-1", {
      studentId: "student-1",
      code: "<h1>R-13</h1>",
      status: "coding",
      previewPreset: "mobile",
      previewScrollY: 280,
      activePane: "result",
    })).toMatchObject({
      previewPreset: "mobile",
      previewScrollY: 280,
      activePane: "result",
    });
  });

  it("falls back to safe preview defaults", () => {
    expect(parseSession("student-1", {
      code: "",
      status: "invalid",
      previewPreset: "cinema",
      previewScrollY: -10,
      activePane: "other",
    })).toMatchObject({
      status: "idle",
      previewPreset: "fit",
      previewScrollY: 0,
      activePane: "code",
    });
  });
});
