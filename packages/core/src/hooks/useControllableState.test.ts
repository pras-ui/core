import { renderHook, act } from "@testing-library/react";
import { useControllableState } from "./useControllableState";
import { describe, it, expect, vi } from "vitest";

describe("useControllableState", () => {
  it("should be uncontrolled when defaultValue is provided", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: "initial" })
    );
    const [value, setValue] = result.current;

    expect(value).toBe("initial");

    act(() => {
      setValue("new value");
    });

    expect(result.current[0]).toBe("new value");
  });

  it("should be controlled when value is provided", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, onChange }),
      { initialProps: { value: "initial" } }
    );

    const [value, setValue] = result.current;
    expect(value).toBe("initial");

    act(() => {
      setValue("new value");
    });

    expect(onChange).toHaveBeenCalledWith("new value");
    // The value should not change until the parent component updates the `value` prop
    expect(result.current[0]).toBe("initial");

    rerender({ value: "new value" });
    expect(result.current[0]).toBe("new value");
  });

  it("should call onChange when state changes", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: "initial", onChange })
    );

    act(() => {
      const [, setValue] = result.current;
      setValue("new value");
    });

    expect(onChange).toHaveBeenCalledWith("new value");
  });

  it("should update with functional update", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 1 })
    );

    act(() => {
      const [, setValue] = result.current;
      setValue((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });
});
