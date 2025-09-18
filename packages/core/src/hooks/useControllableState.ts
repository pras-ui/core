import { useState, useCallback, useEffect } from "react";

type ControllableStateProps<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

export function useControllableState<T>({
  value: valueProp,
  defaultValue,
  onChange,
}: ControllableStateProps<T>): [T, (value: T | ((prev: T) => T)) => void] {
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue
  );

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const newValue =
        typeof nextValue === "function"
          ? (nextValue as (prev: T) => T)(value as T)
          : nextValue;

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange, value]
  );

  useEffect(() => {
    if (isControlled && valueProp !== undefined && valueProp !== value) {
      setInternalValue(valueProp);
    }
  }, [isControlled, valueProp, value]);

  return [value as T, setValue];
}
