// hooks
export { useMergeRefs } from "./hooks/useMergeRefs";
export { useId } from "./hooks/useId";
export { useControllableState } from "./hooks/useControllableState";

// utils
export { createContextScope } from "./createContext";
export { composeEventHandlers } from "./events";
export { ShortcutProvider } from "./ShortcutProvider";
export { type KeybindyShortcut as ShortcutType } from "@keybindy/react";

// types
type InternalOnlyProps = "childProps";

export { type TypeCompose } from "./type-composer";

export type ComponentPropsWithoutInternalProps<T extends React.ElementType> =
  Omit<React.ComponentPropsWithoutRef<T>, InternalOnlyProps>;
