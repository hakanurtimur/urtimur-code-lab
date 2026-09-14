import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { basicHtmlModule } from "./data/basic-html";
import { CurriculumDashboard } from "./curriculum-dashboard";
import { getGamesForWeek } from "@/features/games/data/basic-html-games";
import { AuthProvider } from "@/features/auth/auth-provider";

vi.mock("@/features/auth/session-controls", () => ({
  StudentSessionControls: () => <span>Yerel mod</span>,
}));

describe("CurriculumDashboard", () => {
  beforeEach(() => localStorage.clear());

  it("shows an inline eight-week learning path with one recommended lesson", () => {
    const [firstWeek, , thirdWeek] = basicHtmlModule.weeks;
    const firstLesson = firstWeek.lessons[0];
    const { container } = render(
      <AuthProvider><CurriculumDashboard modules={[basicHtmlModule]} /></AuthProvider>,
    );

    expect(container.querySelectorAll("[data-learning-path-week]")).toHaveLength(8);
    expect(container.querySelector(`[data-learning-path-week="${firstWeek.id}"]`)).toHaveAttribute(
      "data-week-state",
      "current",
    );
    expect(container.querySelector(`[data-learning-path-week="${thirdWeek.id}"]`)).toHaveAttribute(
      "data-week-state",
      "locked",
    );
    expect(container.querySelector(`[data-learning-path-lessons="${firstWeek.id}"]`)).toBeInTheDocument();

    const continueLinks = screen.getAllByRole("link", { name: /derse devam et/i });
    expect(continueLinks).toHaveLength(2);
    expect(continueLinks[0]).toHaveAttribute("href", `/lesson/${firstLesson.id}`);
    expect(continueLinks[1]).toHaveAttribute("href", `/lesson/${firstLesson.id}`);
  });

  it("expands an unlocked week in place and keeps locked weeks non-navigable", async () => {
    const user = userEvent.setup();
    const [, secondWeek, thirdWeek] = basicHtmlModule.weeks;
    const { container } = render(
      <AuthProvider><CurriculumDashboard modules={[basicHtmlModule]} /></AuthProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`Hafta ${secondWeek.order}:`, "i"),
      }),
    );

    const weekTwoLessons = await waitFor(() => {
      const element = container.querySelector<HTMLElement>(
        `[data-learning-path-lessons="${secondWeek.id}"]`,
      );
      expect(element).toBeInTheDocument();
      return element as HTMLElement;
    });

    expect(within(weekTwoLessons).getAllByRole("link")).toHaveLength(secondWeek.lessons.length + getGamesForWeek(secondWeek.id).length);

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`Hafta ${thirdWeek.order}:`, "i"),
      }),
    );

    const lockedWeek = await waitFor(() => {
      const element = container.querySelector<HTMLElement>(
        `[data-learning-path-lessons="${thirdWeek.id}"]`,
      );
      expect(element).toBeInTheDocument();
      return element as HTMLElement;
    });

    expect(lockedWeek).toHaveTextContent(/öğretmenin açtığında/i);
    expect(within(lockedWeek).queryByRole("link")).not.toBeInTheDocument();
  });
});
