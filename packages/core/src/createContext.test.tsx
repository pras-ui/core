import { render, renderHook } from "@testing-library/react";
import { createContextScope } from "./createContext";
import { describe, it, expect } from "vitest";
import React from "react";

describe("createContextScope", () => {
  it("should provide and consume context", () => {
    const [ScopeProvider, useScope] = createContextScope("TestScope");
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ScopeProvider scopeId="test" value={{ foo: "bar" }}>
        {children}
      </ScopeProvider>
    );

    const { result } = renderHook(() => useScope(), { wrapper });
    expect(result.current.foo).toBe("bar");
    expect(result.current.__scopeId).toBe("test");
  });

  it("should throw error when used outside of provider", () => {
    const [, useScope] = createContextScope("TestScope");
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};
    const hookCall = () => renderHook(() => useScope());
    expect(hookCall).toThrow(
      "[TestScope] context is missing. Make sure you are using the Provider."
    );
    console.error = originalError;
  });

  it("should use default value if provided", () => {
    const [, useScope] = createContextScope("TestScope", [], {
      foo: "default",
    });
    const { result } = renderHook(() => useScope());
    expect(result.current.foo).toBe("default");
  });

  it("should compose scopes", () => {
    const [ScopeProvider1, , createScope1] = createContextScope("Scope1");
    const [ScopeProvider2, , createScope2] = createContextScope(
      "Scope2",
      [createScope1]
    );

    let combinedScope: any;

    const TestComponent = () => {
      combinedScope = createScope2();
      return null;
    };

    render(
      <ScopeProvider1 scopeId="s1" value={{ val1: "v1" }}>
        <ScopeProvider2 scopeId="s2" value={{ val2: "v2" }}>
          <TestComponent />
        </ScopeProvider2>
      </ScopeProvider1>
    );

    expect(combinedScope.Scope1.value.val1).toBe("v1");
    expect(combinedScope.Scope2.value.val2).toBe("v2");
  });
});
