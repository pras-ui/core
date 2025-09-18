import { renderHook, act } from "@testing-library/react";
import { usePresence } from "./usePresence";
import { describe, it, expect, vi } from "vitest";

class MockAnimationEvent extends Event {
  animationName: string;
  constructor(type: string, options: AnimationEventInit = {}) {
    super(type, options);
    this.animationName = options.animationName || "";
  }
}
(global as any).AnimationEvent = MockAnimationEvent;

describe("usePresence", () => {
  it("should be present when initially true", () => {
    const { result } = renderHook(() => usePresence(true));
    expect(result.current.isPresent).toBe(true);
  });

  it("should not be present when initially false", () => {
    const { result } = renderHook(() => usePresence(false));
    expect(result.current.isPresent).toBe(false);
  });

  it("should transition from false to true", () => {
    const { result, rerender } = renderHook(({ present }) => usePresence(present), {
      initialProps: { present: false },
    });

    expect(result.current.isPresent).toBe(false);

    rerender({ present: true });

    expect(result.current.isPresent).toBe(true);
  });

  it("should transition from true to false and wait for animation", () => {
    const { result, rerender } = renderHook(({ present }) => usePresence(present), {
      initialProps: { present: true },
    });

    const mockElement = document.createElement("div");
    const mockStyle = { animationName: "exit-animation" } as CSSStyleDeclaration;
    vi.spyOn(window, "getComputedStyle").mockReturnValue(mockStyle);

    act(() => {
      result.current.ref(mockElement);
    });

    rerender({ present: false });

    expect(result.current.isPresent).toBe(true);

    const animationEndEvent = new AnimationEvent("animationend", {
      animationName: "exit-animation",
    });
    act(() => {
      mockElement.dispatchEvent(animationEndEvent);
    });

    expect(result.current.isPresent).toBe(false);
  });
});
