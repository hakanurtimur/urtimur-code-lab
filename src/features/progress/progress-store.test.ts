import { beforeEach, describe, expect, it } from "vitest";
import {
  markLessonCompleted,
  parseCompletedLessonIds,
  readCompletedLessonIds,
} from "./progress-store";

describe("progress-store", () => {
  beforeEach(() => localStorage.clear());

  it("returns an empty list when no progress exists", () => {
    expect(readCompletedLessonIds(localStorage)).toEqual([]);
  });

  it("marks lesson completion idempotently", () => {
    markLessonCompleted(localStorage, "html-document-structure");
    markLessonCompleted(localStorage, "html-document-structure");

    expect(readCompletedLessonIds(localStorage)).toEqual(["html-document-structure"]);
  });

  it("parses only string lesson ids from a stored snapshot", () => {
    expect(parseCompletedLessonIds('{"completedLessonIds":["lesson-1",42,null]}')).toEqual([
      "lesson-1",
    ]);
  });
});
