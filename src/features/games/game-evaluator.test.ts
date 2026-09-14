import { describe, expect, it } from "vitest";
import { basicHtmlGames } from "./data/basic-html-games";
import { evaluateGame } from "./game-evaluator";

describe("evaluateGame", () => {
  it("evaluates order games exactly", () => {
    const game = basicHtmlGames.find((item) => item.kind === "order")!;
    expect(evaluateGame(game, game.kind === "order" ? game.items : [])).toEqual({ score: game.kind === "order" ? game.items.length : 0, total: game.kind === "order" ? game.items.length : 0, completed: true });
  });

  it("evaluates matching games", () => {
    const game = basicHtmlGames.find((item) => item.kind === "match")!;
    if (game.kind !== "match") throw new Error("match game missing");
    const answers = Object.fromEntries(game.pairs.map((pair) => [pair.id, pair.right]));
    expect(evaluateGame(game, answers).completed).toBe(true);
  });
});
