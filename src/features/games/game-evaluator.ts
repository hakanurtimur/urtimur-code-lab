import type { LessonGame } from "./types";

export function evaluateGame(game: LessonGame, answers: Record<string, string> | string[]): { score: number; total: number; completed: boolean } {
  if (game.kind === "order") {
    const values = Array.isArray(answers) ? answers : [];
    const score = game.items.reduce((count, item, index) => count + Number(values[index] === item), 0);
    return { score, total: game.items.length, completed: score === game.items.length };
  }

  const values = Array.isArray(answers) ? {} : answers;
  if (game.kind === "match") {
    const score = game.pairs.reduce((count, pair) => count + Number(values[pair.id] === pair.right), 0);
    return { score, total: game.pairs.length, completed: score === game.pairs.length };
  }

  const score = game.questions.reduce((count, question) => count + Number(values[question.id] === question.answer), 0);
  return { score, total: game.questions.length, completed: score === game.questions.length };
}
