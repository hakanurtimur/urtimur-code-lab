import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LivePreview } from "./live-preview";

describe("LivePreview", () => {
  it("renders learner HTML in a script-free same-origin sandbox", () => {
    render(<LivePreview source="<h1>Merhaba</h1>" />);

    const iframe = screen.getByTitle("Canlı önizleme");
    expect(iframe).toHaveAttribute("srcdoc", "<h1>Merhaba</h1>");
    expect(iframe).toHaveAttribute("sandbox", "allow-same-origin");
  });

  it("supports a controlled viewport preset and reports changes", () => {
    const onModeChange = vi.fn();
    render(
      <LivePreview
        source="<h1>Merhaba</h1>"
        mode="mobile"
        onModeChange={onModeChange}
      />,
    );

    expect(screen.getByText("390 × 844")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mobile/i })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: /desktop/i }));
    expect(onModeChange).toHaveBeenCalledWith("desktop");
  });
});
