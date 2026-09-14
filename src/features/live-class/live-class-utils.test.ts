import { describe, expect, it } from "vitest";
import {
  composeLiveClassDocument,
  isLiveClassViewerOnline,
  shouldPublishLiveClass,
} from "./live-class-utils";

describe("live class utilities", () => {
  it("composes html css and js into one sandbox document", () => {
    const source = composeLiveClassDocument(
      "<h1>Hello</h1>",
      "h1 { color: red; }",
      "document.body.dataset.ready = 'yes';",
    );

    expect(source).toContain("<style>h1 { color: red; }</style>");
    expect(source).toContain("<h1>Hello</h1>");
    expect(source).toContain("<script>document.body.dataset.ready = 'yes';</script>");
  });

  it("publishes only while live", () => {
    expect(shouldPublishLiveClass("live")).toBe(true);
    expect(shouldPublishLiveClass("frozen")).toBe(false);
    expect(shouldPublishLiveClass("ended")).toBe(false);
  });

  it("treats only recent viewer heartbeats as online", () => {
    expect(isLiveClassViewerOnline(90_000, 100_000)).toBe(true);
    expect(isLiveClassViewerOnline(40_000, 100_000)).toBe(false);
  });
});
