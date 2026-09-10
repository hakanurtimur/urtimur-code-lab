import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { basicHtmlModule } from "@/features/curriculum/data/basic-html";
import { LessonWorkspace } from "./lesson-workspace";
import { AuthProvider } from "@/features/auth/auth-provider";

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
  beforeEach(() => localStorage.clear());

  it("shows lesson context and completes the lesson after all checks pass", async () => {
    const user = userEvent.setup();
    const week = basicHtmlModule.weeks[0];
    const lesson = week.lessons[0];
    render(<AuthProvider><LessonWorkspace lesson={lesson} week={week} /></AuthProvider>);

    expect(screen.getAllByText(/Hafta 1/i).length).toBeGreaterThan(0);
    expect(screen.getByText(lesson.title)).toBeInTheDocument();
    expect(screen.getByText(lesson.fccCheckpoint)).toBeInTheDocument();
    expect(screen.getByDisplayValue(lesson.starterCode)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /kodumu kontrol et/i }));
    expect(screen.queryByRole("button", { name: /dersi tamamla/i })).not.toBeInTheDocument();

    const validSource = `<h1>R-13 Bakım Kaydı</h1>\n<h2>Durum</h2>\n<p>Sol motor kalibrasyon bekliyor.</p>\n<p>Batarya seviyesi yüzde 82.</p>`;

    fireEvent.change(screen.getByLabelText("HTML kod editörü"), {
      target: { value: validSource },
    });
    await user.click(screen.getByRole("button", { name: /kodumu kontrol et/i }));

    expect(screen.getByRole("status")).toHaveTextContent("3 / 3 test geçti");
    expect(screen.getByText(/tüm kontroller geçti/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /dersi tamamla/i }));
    expect(screen.getByText(/kaydedildi/i)).toBeInTheDocument();
  });
});
