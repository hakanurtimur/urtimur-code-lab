import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestResults } from "./test-results";

describe("TestResults", () => {
  it("shows passed and failed checks accessibly", () => {
    render(
      <TestResults
        results={[
          { id: "a", label: "h1 var", passed: true },
          { id: "b", label: "title eksik", passed: false },
        ]}
      />,
    );

    expect(screen.getByText("h1 var")).toBeInTheDocument();
    expect(screen.getByText("title eksik")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 / 2 test geçti");
  });
});
