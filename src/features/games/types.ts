export type GameTone = "violet" | "sky" | "peach" | "mint" | "pink" | "yellow";

export type GameBase = {
  id: string;
  weekId: string;
  weekOrder: number;
  title: string;
  description: string;
  eyebrow: string;
  tone: GameTone;
};

export type MatchGame = GameBase & {
  kind: "match";
  pairs: Array<{ id: string; left: string; right: string }>;
};

export type OrderGame = GameBase & {
  kind: "order";
  items: string[];
};

export type QuizGame = GameBase & {
  kind: "quiz";
  questions: Array<{
    id: string;
    prompt: string;
    options: string[];
    answer: string;
    explanation: string;
  }>;
};

export type LessonGame = MatchGame | OrderGame | QuizGame;

export type GameResult = {
  score: number;
  total: number;
  completed: boolean;
};
