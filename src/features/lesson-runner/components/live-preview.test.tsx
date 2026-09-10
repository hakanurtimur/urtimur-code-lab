import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LivePreview } from "./live-preview";

describe("LivePreview", () => {
  it("renders learner HTML in a sandboxed iframe", () => {
    render(<LivePreview source="<h1>Merhaba</h1>" />);

    const iframe = screen.getByTitle("Canlı önizleme");
    expect(iframe).toHaveAttribute("srcdoc", "<h1>Merhaba</h1>");
    expect(iframe).toHaveAttribute("sandbox", "");
  });

  it("offers fit, desktop, tablet and mobile viewport presets", () => {
    render(<LivePreview source="<h1>Merhaba</h1>" />);

    expect(screen.getByRole("button", { name: /fit/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /desktop/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tablet/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mobile/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /mobile/i }));
    expect(screen.getByText("390 × 844")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mobile/i })).toHaveAttribute("aria-pressed", "true");
  });
});
