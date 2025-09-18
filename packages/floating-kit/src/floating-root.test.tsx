import { renderHook, act } from "@testing-library/react";
import { FloatingRoot, useFloatingContext } from "./floating-root";
import { describe, it, expect } from "vitest";
import React from "react";

describe("FloatingRoot", () => {
  it("should provide floating context", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FloatingRoot>{children}</FloatingRoot>
    );
    const { result } = renderHook(() => useFloatingContext(), { wrapper });

    expect(result.current.anchor).toBe(null);
    expect(typeof result.current.setAnchor).toBe("function");

    const div = document.createElement("div");
    act(() => {
      result.current.setAnchor(div);
    });

    expect(result.current.anchor).toBe(div);
  });
});
