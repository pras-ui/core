import { composeEventHandlers } from "./events";
import { describe, it, expect, vi } from "vitest";
import React from "react";

describe("composeEventHandlers", () => {
  it("should call all handlers", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const composed = composeEventHandlers(handler1, handler2);
    const event = {} as React.SyntheticEvent;
    composed(event);
    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).toHaveBeenCalledWith(event);
  });

  it("should stop calling handlers if default is prevented", () => {
    const handler1 = vi.fn((e) => e.preventDefault());
    const handler2 = vi.fn();
    const composed = composeEventHandlers(handler1, handler2);

    const event = {
      defaultPrevented: false,
      preventDefault: () => {
        (event as any).defaultPrevented = true;
      },
    } as React.SyntheticEvent;

    composed(event);

    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).not.toHaveBeenCalled();
  });

  it("should handle undefined handlers", () => {
    const handler1 = vi.fn();
    const composed = composeEventHandlers(undefined, handler1, undefined);
    const event = {} as React.SyntheticEvent;
    composed(event);
    expect(handler1).toHaveBeenCalledWith(event);
  });
});
