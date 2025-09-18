import { renderHook } from "@testing-library/react";
import { useId } from "./useId";
import { describe, it, expect } from "vitest";

describe("useId", () => {
  it("should return a string id", () => {
    const { result } = renderHook(() => useId());
    expect(typeof result.current).toBe("string");
  });

  it("should return a consistent id across re-renders", () => {
    const { result, rerender } = renderHook(() => useId());
    const firstId = result.current;
    rerender();
    const secondId = result.current;
    expect(firstId).toBe(secondId);
  });

  it("should start with the provided prefix", () => {
    const { result } = renderHook(() => useId("custom-prefix"));
    expect(result.current.startsWith("custom-prefix-")).toBe(true);
  });

  it("should generate unique ids for different components", () => {
    const { result: result1 } = renderHook(() => useId());
    const { result: result2 } = renderHook(() => useId());
    expect(result1.current).not.toBe(result2.current);
  });
});
