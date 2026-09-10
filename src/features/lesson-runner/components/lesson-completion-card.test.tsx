import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { basicHtmlModule } from "@/features/curriculum/data/basic-html";
import { getLessonCompletionHandoff } from "@/features/curriculum/lesson-navigation";
import { LessonCompletionCard } from "./lesson-completion-card";

describe("LessonCompletionCard", () => {
  it("asks the student to wait when the next week is locked", () => {
    const week = basicHtmlModule.weeks[1];
    const lesson = week.lessons.at(-1)!;
    const handoff = getLessonCompletionHandoff(
      lesson,
      basicHtmlModule.weeks,
      week.lessons.slice(0, -1).map((item) => item.id),
      2,
    );

    render(
      <LessonCompletionCard
        lesson={lesson}
        handoff={handoff}
        completed={false}
        completing={false}
        onCompleteStay={vi.fn()}
        onCompleteAndNavigate={vi.fn()}
      />,
    );

    expect(screen.getByText(/sonraki rota öğretmenin açtığında/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sonraki haftayı keşfet/i })).not.toBeInTheDocument();
  });
});
