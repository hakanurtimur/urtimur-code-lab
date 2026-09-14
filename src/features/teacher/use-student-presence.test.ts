import { describe, expect, it } from "vitest";
import { Timestamp } from "firebase/firestore";
import { parsePresence } from "./use-student-presence";

describe("parsePresence", () => {
  it("normalizes a dashboard presence record", () => {
    const lastSeen = Timestamp.fromMillis(1234);
    expect(parsePresence("s1", {
      studentId: "s1",
      online: true,
      currentPath: "/",
      currentLessonId: null,
      visibility: "visible",
      lastSeen,
    })).toEqual({
      studentId: "s1",
      online: true,
      currentPath: "/",
      currentLessonId: null,
      visibility: "visible",
      lastSeenMs: 1234,
    });
  });
});
