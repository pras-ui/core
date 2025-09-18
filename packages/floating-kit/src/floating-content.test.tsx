import { render, screen } from "@testing-library/react";
import { FloatingContent } from "./floating-content";
import { FloatingRoot } from "./floating-root";
import { describe, it, expect, vi } from "vitest";
import React from "react";

// Mock floating-ui to control its output
vi.mock("@floating-ui/react-dom", async () => {
  const actual = await vi.importActual<typeof import("@floating-ui/react-dom")>("@floating-ui/react-dom");
  return {
    ...actual,
    useFloating: (options: any) => ({
      refs: {
        setFloating: vi.fn(),
        setReference: vi.fn(),
      },
      floatingStyles: {
        position: "absolute",
        left: "0",
        top: "0",
        transform: "translate(10px, 10px)",
      },
      isPositioned: true,
      placement: options.placement || "bottom-center",
      middlewareData: {},
    }),
  };
});

describe("FloatingContent", () => {
  const renderInProvider = (ui: React.ReactElement) => {
    return render(<FloatingRoot>{ui}</FloatingRoot>);
  };

  it("should render children when isPresent is true", () => {
    renderInProvider(
      <FloatingContent isPresent={true}>
        <div>Content</div>
      </FloatingContent>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should render children when alwaysRender is true, even if isPresent is false", () => {
    renderInProvider(
      <FloatingContent isPresent={false} alwaysRender={true}>
        <div>Content</div>
      </FloatingContent>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should have correct data attributes for side and align", () => {
    renderInProvider(
      <FloatingContent isPresent={true} side="top" align="end">
        <div>Content</div>
      </FloatingContent>
    );
    const content = screen.getByText("Content").parentElement;
    expect(content).toHaveAttribute("data-side", "top");
    expect(content).toHaveAttribute("data-align", "end");
  });
});
