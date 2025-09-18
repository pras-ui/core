import { render, screen, renderHook } from "@testing-library/react";
import { DirectionProvider, useDirection } from "./dir";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Test Component
const TestComponent = () => {
  const dir = useDirection();
  return <div data-testid="direction">{dir}</div>;
};

describe("@pras-ui/direction", () => {
  beforeEach(() => {
    // Reset the document direction before each test
    document.documentElement.removeAttribute("dir");
  });

  it('should provide "ltr" as the default direction', () => {
    render(
      <DirectionProvider>
        <TestComponent />
      </DirectionProvider>
    );
    expect(screen.getByTestId("direction")).toHaveTextContent("ltr");
  });

  it("should provide the direction passed as a prop", () => {
    render(
      <DirectionProvider dir="rtl">
        <TestComponent />
      </DirectionProvider>
    );
    expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
  });

  it("should get the direction from the <html> element if no prop is provided", () => {
    document.documentElement.setAttribute("dir", "rtl");
    render(
      <DirectionProvider>
        <TestComponent />
      </DirectionProvider>
    );
    expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
  });

  it("should prioritize the prop over the <html> element attribute", () => {
    document.documentElement.setAttribute("dir", "rtl");
    render(
      <DirectionProvider dir="ltr">
        <TestComponent />
      </DirectionProvider>
    );
    expect(screen.getByTestId("direction")).toHaveTextContent("ltr");
  });

  it("should throw an error if useDirection is used outside of a DirectionProvider", () => {
    // We silence the expected console.error.
    const originalError = console.error;
    console.error = vi.fn();

    const hookCall = () => renderHook(() => useDirection());

    expect(hookCall).toThrow(
      "useDirection must be used within a DirectionProvider"
    );

    console.error = originalError;
  });
});
