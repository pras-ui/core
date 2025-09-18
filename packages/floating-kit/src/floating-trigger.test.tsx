import { render, waitFor } from "@testing-library/react";
import { FloatingTrigger } from "./floating-trigger";
import { FloatingRoot, useFloatingContext } from "./floating-root";
import { describe, it, expect } from "vitest";
import React from "react";

describe("FloatingTrigger", () => {
  it("should set the anchor on the floating context", async () => {
    const contextRef = {
      current: null as null | ReturnType<typeof useFloatingContext>,
    };
    const ContextReader = () => {
      const ctx = useFloatingContext();
      contextRef.current = ctx;
      return null;
    };

    render(
      <FloatingRoot>
        <ContextReader />
        <FloatingTrigger>
          <button>Trigger</button>
        </FloatingTrigger>
      </FloatingRoot>
    );

    await waitFor(() => {
      expect(contextRef.current?.anchor).toBeInstanceOf(HTMLButtonElement);
    });
  });

  it("should use virtualTrigger if provided", async () => {
    const virtualElement = document.createElement("div");
    const virtualTriggerRef = React.createRef<HTMLElement>();
    virtualTriggerRef.current = virtualElement;

    const contextRef = {
      current: null as null | ReturnType<typeof useFloatingContext>,
    };
    const ContextReader = () => {
      const ctx = useFloatingContext();
      contextRef.current = ctx;
      return null;
    };

    render(
      <FloatingRoot>
        <ContextReader />
        <FloatingTrigger virtualTrigger={virtualTriggerRef}>
          <button>Trigger</button>
        </FloatingTrigger>
      </FloatingRoot>
    );

    await waitFor(() => {
      expect(contextRef.current?.anchor).toBe(virtualElement);
    });
  });
});
