import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Brand } from "./brand";

describe("Brand", () => {
  it("renders the Hakan Urtimur Code Lab lockup with the supplied mark", () => {
    render(<Brand />);

    expect(screen.getByText("Hakan Urtimur")).toBeInTheDocument();
    expect(screen.getByText("Code Lab")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Hakan Urtimur Code Lab" })).toBeInTheDocument();
    expect(screen.getByTestId("brand-mark")).toHaveAttribute("src", "/brand/mark-dark.svg");
    expect(screen.getByTestId("brand-mark")).toHaveAttribute("alt", "");
  });
});
