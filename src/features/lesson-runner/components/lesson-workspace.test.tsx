import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { basicHtmlModule } from "@/features/curriculum/data/basic-html";
import { LessonWorkspace } from "./lesson-workspace";
import { AuthProvider } from "@/features/auth/auth-provider";

const push = vi.fn();

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return { ...actual, useRouter: () => ({ push, replace: vi.fn() }) };
});

vi.mock("./code-editor", () => ({
  CodeEditor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      aria-label="HTML kod editörü"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

describe("LessonWorkspace", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
  });

  it("shows position, an in-workspace lesson drawer, and a next-lesson handoff", async () => {
    const user = userEvent.setup();
    const week = basicHtmlModule.weeks[0];
    const lesson = week.lessons[0];
    const { container } = render(<AuthProvider><LessonWorkspace lesson={lesson} week={week} /></AuthProvider>);

    expect(screen.getByText("Ders 1 / 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /tüm dersler/i }));
    expect(screen.getByRole("dialog", { name: /hafta 1 dersleri/i })).toBeInTheDocument();
    expect(screen.getByText(week.lessons[1].title)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /ders listesini kapat/i }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: /hafta 1 dersleri/i })).not.toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /kodumu kontrol et/i }));
    expect(screen.queryByRole("button", { name: /sıradakine geç/i })).not.toBeInTheDocument();

    const validSource = `<h1>R-13 Bakım Kaydı</h1>\n<h2>Durum</h2>\n<p>Sol motor kalibrasyon bekliyor.</p>\n<p>Batarya seviyesi yüzde 82.</p>`;
    fireEvent.change(screen.getByLabelText("HTML kod editörü"), {
      target: { value: validSource },
    });
    await user.click(screen.getByRole("button", { name: /kodumu kontrol et/i }));
    await user.click(screen.getByRole("button", { name: /challenge'a geç/i }));
    await user.click(screen.getByRole("button", { name: /kodumu kontrol et/i }));
    await user.click(screen.getByRole("button", { name: /mini build'a geç/i }));
    await user.click(screen.getByRole("button", { name: /kodumu kontrol et/i }));

    expect(screen.getByRole("status")).toHaveTextContent("3 / 3 test geçti");
    const completionCard = container.querySelector(".lesson-completion-card");
    expect(completionCard).not.toBeNull();
    expect(within(completionCard as HTMLElement).getByText(new RegExp(week.lessons[1].title, "i"))).toBeInTheDocument();
    const nextLessonLink = screen.getByRole("link", { name: /sıradaki derse geç/i });
    expect(nextLessonLink).toHaveAttribute("href", `/lesson/${week.lessons[1].id}`);
  });
});
