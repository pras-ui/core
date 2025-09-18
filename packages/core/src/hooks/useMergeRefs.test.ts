import { renderHook } from "@testing-library/react";
import { useMergeRefs } from "./useMergeRefs";
import { describe, it, expect } from "vitest";
import React from "react";

describe("useMergeRefs", () => {
  it("should merge multiple refs", () => {
    const ref1 = React.createRef<HTMLDivElement>();
    const ref2 = React.createRef<HTMLDivElement>();
    const { result } = renderHook(() => useMergeRefs(ref1, ref2));

    const div = document.createElement("div");
    result.current(div);

    expect(ref1.current).toBe(div);
    expect(ref2.current).toBe(div);
  });

  it("should handle function refs", () => {
    let refValue: HTMLDivElement | null = null;
    const functionRef = (node: HTMLDivElement) => {
      refValue = node;
    };
    const { result } = renderHook(() => useMergeRefs(functionRef));

    const div = document.createElement("div");
    result.current(div);

    expect(refValue).toBe(div);
  });

  it("should handle a mix of ref objects and function refs", () => {
    const ref1 = React.createRef<HTMLDivElement>();
    let refValue: HTMLDivElement | null = null;
    const functionRef = (node: HTMLDivElement) => {
      refValue = node;
    };
    const { result } = renderHook(() => useMergeRefs(ref1, functionRef));

    const div = document.createElement("div");
    result.current(div);

    expect(ref1.current).toBe(div);
    expect(refValue).toBe(div);
  });

  it("should handle null or undefined refs", () => {
    const ref1 = React.createRef<HTMLDivElement>();
    const { result } = renderHook(() => useMergeRefs(ref1, null, undefined));

    const div = document.createElement("div");
    result.current(div);

    expect(ref1.current).toBe(div);
  });

  it("should return a cleanup function", () => {
    const ref1 = React.createRef<HTMLDivElement>();
    let refValue: HTMLDivElement | null = null;
    const functionRef = (node: HTMLDivElement | null) => {
      refValue = node;
    };

    const { result } = renderHook(() => useMergeRefs(ref1, functionRef));

    const div = document.createElement("div");
    const cleanup = result.current(div);

    expect(ref1.current).toBe(div);
    expect(refValue).toBe(div);

    if (cleanup) {
      cleanup();
    }

    expect(ref1.current).toBe(null);
    expect(refValue).toBe(null);
  });
});
