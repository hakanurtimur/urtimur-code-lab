import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { basicHtmlModule } from "./data/basic-html";
import { CurriculumDashboard } from "./curriculum-dashboard";
import { AuthProvider } from "@/features/auth/auth-provider";

describe("CurriculumDashboard", () => {
  beforeEach(() => localStorage.clear());

  it("prioritizes the earliest companion lesson and shows the complete eight-week route", () => {
    const firstAvailableWeek = basicHtmlModule.weeks.find((week) => week.fccStatus !== "upcoming");
    const firstLesson = firstAvailableWeek?.lessons[0];

    const { container } = render(<AuthProvider><CurriculumDashboard modules={[basicHtmlModule]} /></AuthProvider>);

    expect(screen.getByText("Devam et")).toBeInTheDocument();
    expect(screen.getAllByText(firstAvailableWeek?.theme ?? "").length).toBeGreaterThan(0);
    expect(screen.getAllByText(firstLesson?.title ?? "").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /derse devam et/i })).toHaveAttribute(
      "href",
      `/lesson/${firstLesson?.id}`,
    );
    expect(container.querySelectorAll("[data-week-card]")).toHaveLength(8);
    expect(container.querySelector("[data-section='weekly-outcomes']")?.querySelectorAll("ol > li")).toHaveLength(5);
  });
});
