import type {
  CurriculumWeek,
  LearningOutcome,
  Lesson,
  QuickRecallQuestion,
} from "../../types";

type FiveStrings = [string, string, string, string, string];

type RecallInput = [question: string, answer: string];

type LessonInput = Omit<
  Lesson,
  "moduleId" | "weekId" | "weekOrder" | "order" | "eyebrow" | "outcomes" | "quickRecall"
> & {
  outcomes: FiveStrings;
  quickRecall: [RecallInput, RecallInput, RecallInput];
};

export function fiveOutcomes(values: FiveStrings): LearningOutcome[] {
  return values.map((text, index) => ({ id: `o${index + 1}`, text }));
}

export function makeLesson(weekOrder: number, order: number, input: LessonInput): Lesson {
  return {
    ...input,
    order,
    moduleId: "basic-html",
    weekId: `basic-html-week-${weekOrder}`,
    weekOrder,
    eyebrow: `Hafta ${weekOrder} · Ders ${order}`,
    outcomes: fiveOutcomes(input.outcomes),
    quickRecall: input.quickRecall.map(([question, answer], index) => ({
      id: `q${index + 1}`,
      question,
      answer,
    })) satisfies QuickRecallQuestion[],
  };
}

export function makeWeek(
  input: Omit<CurriculumWeek, "id" | "outcomes"> & { outcomes: FiveStrings },
): CurriculumWeek {
  return {
    ...input,
    id: `basic-html-week-${input.order}`,
    outcomes: fiveOutcomes(input.outcomes),
  };
}
