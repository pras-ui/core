// hooks
export { useMergeRefs } from "./hooks/useMergeRefs";
export { useId } from "./hooks/useId";
export { useControllableState } from "./hooks/useControllableState";

// utils
export { createContextScope } from "./createContext";
export { composeEventHandlers } from "./events";

// types
type InternalOnlyProps = "childProps";

export type ComponentPropsWithoutInternalProps<T extends React.ElementType> =
  Omit<React.ComponentPropsWithoutRef<T>, InternalOnlyProps>;
