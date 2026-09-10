import type { LessonTest } from "@/features/curriculum/types";

export type TestResult = {
  id: string;
  label: string;
  passed: boolean;
};

function hasExplicitDocumentStructure(source: string) {
  const normalized = source.toLowerCase();
  const tokens = [
    /<html(?:\s[^>]*)?>/,
    /<head(?:\s[^>]*)?>/,
    /<\/head\s*>/,
    /<body(?:\s[^>]*)?>/,
    /<\/body\s*>/,
    /<\/html\s*>/,
  ];

  let cursor = 0;
  for (const token of tokens) {
    const match = normalized.slice(cursor).match(token);
    if (!match || match.index === undefined) return false;
    cursor += match.index + match[0].length;
  }

  return true;
}

export function runHtmlTests(source: string, tests: LessonTest[]): TestResult[] {
  const parser = new DOMParser();
  const document = parser.parseFromString(source, "text/html");

  return tests.map((test) => {
    let passed = false;

    switch (test.kind) {
      case "selector":
        passed = Boolean(document.querySelector(test.selector));
        break;
      case "attribute": {
        const element = document.querySelector(test.selector);
        passed = element?.getAttribute(test.attribute) === test.value;
        break;
      }
      case "text": {
        const element = document.querySelector(test.selector);
        passed = element?.textContent?.trim() === test.text;
        break;
      }
      case "selector-count":
        passed = document.querySelectorAll(test.selector).length >= test.min;
        break;
      case "source-includes":
        passed = source.includes(test.value);
        break;
      case "doctype":
        passed = /^\s*<!doctype\s+html\s*>/i.test(source);
        break;
      case "document-structure":
        passed = hasExplicitDocumentStructure(source);
        break;
    }

    return { id: test.id, label: test.label, passed };
  });
}
