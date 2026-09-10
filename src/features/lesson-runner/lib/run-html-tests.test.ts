import { describe, expect, it } from "vitest";
import type { LessonTest } from "@/features/curriculum/types";
import { runHtmlTests } from "./run-html-tests";

const tests: LessonTest[] = [
  {
    id: "structure",
    label: "belge iskeleti var",
    kind: "document-structure",
  },
  {
    id: "lang-tr",
    label: "sayfa dili Türkçe",
    kind: "attribute",
    selector: "html",
    attribute: "lang",
    value: "tr",
  },
  {
    id: "title-text",
    label: "başlık var",
    kind: "text",
    selector: "title",
    text: "İlk Web Sayfam",
  },
  {
    id: "doctype",
    label: "doctype var",
    kind: "doctype",
  },
];

describe("runHtmlTests", () => {
  it("supports selector, attribute, text and doctype checks", () => {
    const source = `<!DOCTYPE html>
<html lang="tr">
  <head><title>İlk Web Sayfam</title></head>
  <body><h1>Merhaba</h1></body>
</html>`;

    expect(runHtmlTests(source, tests).every((result) => result.passed)).toBe(true);
  });

  it("supports minimum selector counts", () => {
    const source = `<!DOCTYPE html><html><head><title>x</title></head><body>
      <p>Bir</p><p>İki</p><p>Üç</p>
    </body></html>`;

    const result = runHtmlTests(source, [
      {
        id: "three-paragraphs",
        label: "en az üç paragraf var",
        kind: "selector-count",
        selector: "p",
        min: 3,
      },
    ]);

    expect(result[0].passed).toBe(true);
  });

  it("fails minimum selector counts below the threshold", () => {
    const result = runHtmlTests("<p>Bir</p><p>İki</p>", [
      {
        id: "three-paragraphs",
        label: "en az üç paragraf var",
        kind: "selector-count",
        selector: "p",
        min: 3,
      },
    ]);

    expect(result[0].passed).toBe(false);
  });

  it("returns a failed result instead of throwing for missing markup", () => {
    const results = runHtmlTests("<p>Eksik sayfa</p>", tests);

    expect(results.some((result) => !result.passed)).toBe(true);
    expect(results).toHaveLength(tests.length);
  });

  it("rejects an explicitly malformed document order", () => {
    const malformed = `<!DOCTYPE html>
<html lang="tr">
  <body><h1>Yanlış sıra</h1></body>
  <head><title>İlk Web Sayfam</title></head>
</html>`;

    const result = runHtmlTests(malformed, [
      { id: "structure", label: "belge iskeleti var", kind: "document-structure" },
    ]);

    expect(result[0].passed).toBe(false);
  });
});
