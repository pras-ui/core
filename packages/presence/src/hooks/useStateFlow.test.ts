import { renderHook, act } from "@testing-library/react";
import { useStateFlow } from "./useStateFlow";
import { describe, it, expect } from "vitest";

describe("useStateFlow", () => {
  const config = {
    idle: { FETCH: "loading" },
    loading: { SUCCESS: "success", ERROR: "error" },
    success: { FETCH: "loading" },
    error: { FETCH: "loading" },
  };

  it("should initialize with the initial state", () => {
    const { result } = renderHook(() => useStateFlow("idle", config));
    expect(result.current[0]).toBe("idle");
  });

  it("should transition to the correct state", () => {
    const { result } = renderHook(() => useStateFlow("idle", config));
    act(() => {
      result.current[1]("FETCH");
    });
    expect(result.current[0]).toBe("loading");
  });

  it("should not transition if the action is not defined for the current state", () => {
    const { result } = renderHook(() => useStateFlow("idle", config));
    act(() => {
      result.current[1]("SUCCESS");
    });
    expect(result.current[0]).toBe("idle");
  });
});
