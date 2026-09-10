export type LearningOutcome = {
  id: string;
  text: string;
};

export type QuickRecallQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type LessonStage = {
  title: string;
  description: string;
  requirements: string[];
};

export type LessonTest =
  | {
      id: string;
      label: string;
      kind: "selector";
      selector: string;
    }
  | {
      id: string;
      label: string;
      kind: "attribute";
      selector: string;
      attribute: string;
      value: string;
    }
  | {
      id: string;
      label: string;
      kind: "text";
      selector: string;
      text: string;
    }
  | {
      id: string;
      label: string;
      kind: "selector-count";
      selector: string;
      min: number;
    }
  | {
      id: string;
      label: string;
      kind: "source-includes";
      value: string;
    }
  | {
      id: string;
      label: string;
      kind: "doctype";
    }
  | {
      id: string;
      label: string;
      kind: "document-structure";
    };

export type Lesson = {
  id: string;
  order: number;
  moduleId: string;
  weekId: string;
  weekOrder: number;
  title: string;
  eyebrow: string;
  description: string;
  fccCheckpoint: string;
  outcomes: LearningOutcome[];
  quickRecall: QuickRecallQuestion[];
  practice: LessonStage;
  challenge: LessonStage;
  miniBuild: LessonStage;
  starterCode: string;
  tests: LessonTest[];
};

export type FccBlockType = "Workshop" | "Lab" | "Theory" | "Review" | "Quiz";

export type FccBlock = {
  title: string;
  type: FccBlockType;
  scope?: string;
};

export type CurriculumWeek = {
  id: string;
  order: number;
  title: string;
  theme: string;
  summary: string;
  weeklyBuild: string;
  fccStatus: "completed" | "current" | "upcoming";
  fccSteps: {
    start: number;
    end: number;
    total: 137;
  };
  fccBlocks: FccBlock[];
  outcomes: LearningOutcome[];
  lessons: Lesson[];
};

export type CurriculumModule = {
  id: string;
  order: number;
  title: string;
  description: string;
  totalFccSteps: number;
  weeks: CurriculumWeek[];
};
