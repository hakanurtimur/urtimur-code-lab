"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";
import type { TestResult } from "../lib/run-html-tests";

export function TestResults({ results }: { results: TestResult[] }) {
  const reduceMotion = useReducedMotion();
  const passedCount = results.filter((result) => result.passed).length;

  return (
    <div className="test-results-stack">
      <div className="test-result-summary" role="status" aria-live="polite">
        <span>{passedCount} / {results.length} test geçti</span>
        <strong>{passedCount === results.length ? "Tüm kontroller tamam" : `${results.length - passedCount} kontrol daha var`}</strong>
      </div>
      <ul className="test-result-list" aria-label="Test sonuçları">
        {results.map((result, index) => (
          <motion.li
            key={result.id}
            className={result.passed ? "is-pass" : "is-fail"}
            initial={reduceMotion ? false : { opacity: 0, x: -4 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.16, delay: Math.min(index * 0.025, 0.2) }}
          >
            <span aria-hidden="true">{result.passed ? <Check /> : <X />}</span>
            <p>{result.label}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
