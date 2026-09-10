import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TeacherDashboard } from "./teacher-dashboard";
import { updateStudent } from "./teacher-api";

vi.mock("@/features/auth/session-controls", () => ({
  TeacherSessionControls: () => <button type="button">Çıkış yap</button>,
}));

vi.mock("@/features/lesson-runner/components/code-editor", () => ({
  CodeEditor: ({ value, ariaLabel }: { value: string; ariaLabel?: string }) => (
    <textarea aria-label={ariaLabel ?? "Kod editörü"} value={value} readOnly />
  ),
}));

vi.mock("./teacher-api", () => ({
  listStudents: vi.fn(async () => ({
    students: [
      {
        id: "student-1",
        name: "Ege Yılmaz",
        username: "ege_01",
        active: true,
        maxUnlockedWeekOrder: 1,
        createdAt: null,
        updatedAt: null,
      },
      {
        id: "student-2",
        name: "Mina Kaya",
        username: "mina_02",
        active: false,
        maxUnlockedWeekOrder: 2,
        createdAt: null,
        updatedAt: null,
      },
    ],
  })),
  createStudent: vi.fn(),
  updateStudent: vi.fn(async () => ({ ok: true })),
  resetStudentProgress: vi.fn(),
  deleteStudent: vi.fn(),
}));

vi.mock("./use-live-sessions", () => ({
  useLiveSessions: () => ({
    sessions: {
      "student-1": {
        studentId: "student-1",
        lessonId: "w1-robot-profile-debug",
        weekId: "week-1",
        taskId: "challenge",
        code: "<h1>R-13</h1>",
        passedCount: 2,
        totalTests: 3,
        status: "coding",
        lastAction: "Kod yazıyor",
        activePane: "result",
        previewPreset: "mobile",
        previewScrollY: 120,
        previewUpdatedAtMs: Date.now(),
        updatedAtMs: Date.now(),
      },
    },
    error: "",
  }),
}));

vi.mock("./use-student-progress", () => ({
  useStudentProgress: () => ({
    items: [
      {
        lessonId: "w1-robot-profile-debug",
        completed: true,
        attempts: 1,
        lastPassedCount: 3,
        totalTests: 3,
        updatedAtMs: Date.now(),
        completedAtMs: Date.now(),
      },
    ],
    error: "",
  }),
}));

describe("TeacherDashboard", () => {
  it("shows live code, live browser, and teacher-controlled week access", async () => {
    const user = userEvent.setup();
    const { container } = render(<TeacherDashboard />);
    const roster = container.querySelector(".teacher-roster-list");
    expect(roster).not.toBeNull();

    await waitFor(() => expect(within(roster as HTMLElement).getByText("Ege Yılmaz")).toBeInTheDocument());

    expect(screen.getByText("Öğrencinin kodunu, yazarken gör.")).toBeInTheDocument();
    expect(screen.getByLabelText("Ege Yılmaz canlı kodu")).toHaveValue("<h1>R-13</h1>");
    expect(screen.getByTitle("Ege Yılmaz canlı tarayıcı")).toHaveAttribute("srcdoc", "<h1>R-13</h1>");
    expect(screen.getByText("Mobile · 390 × 844")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bölünmüş" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Açık rota: Hafta 1 / 8")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /sonraki haftayı aç/i }));
    await waitFor(() => expect(vi.mocked(updateStudent)).toHaveBeenCalledWith("student-1", {
      maxUnlockedWeekOrder: 2,
    }));

    await user.type(screen.getByPlaceholderText("İsim veya kullanıcı adı ara"), "Mina");
    expect(within(roster as HTMLElement).getByText("Mina Kaya")).toBeInTheDocument();
    expect(within(roster as HTMLElement).queryByText("Ege Yılmaz")).not.toBeInTheDocument();
  });
});
