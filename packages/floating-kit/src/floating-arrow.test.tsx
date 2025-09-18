import { render, screen } from "@testing-library/react";
import { FloatingArrow } from "./floating-arrow";
import {
  FloatingContentProvider,
} from "./floating-content";
import { describe, it, expect, vi } from "vitest";
import React from "react";

describe("FloatingArrow", () => {
  it("should render an svg arrow", () => {
    const registerArrow = vi.fn();
    const unregisterArrow = vi.fn();

    render(
      <FloatingContentProvider
        scopeId="test"
        value={{
          registerArrow,
          unregisterArrow,
          arrow: null,
          side: "bottom",
        }}
      >
        <FloatingArrow data-testid="arrow" />
      </FloatingContentProvider>
    );

    expect(screen.getByTestId("arrow")).toBeInTheDocument();
    expect(screen.getByTestId("arrow").tagName.toUpperCase()).toBe("SVG");
  });

  it("should call registerArrow on mount", () => {
    const registerArrow = vi.fn();
    const unregisterArrow = vi.fn();

    render(
      <FloatingContentProvider
        scopeId="test"
        value={{
          registerArrow,
          unregisterArrow,
          arrow: null,
          side: "bottom",
        }}
      >
        <FloatingArrow />
      </FloatingContentProvider>
    );

    expect(registerArrow).toHaveBeenCalled();
  });
});
