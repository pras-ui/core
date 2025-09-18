import React from "react";
import { useChoiceContext } from "./menu-choice";
import { MenuItem, MenuItemClickEvent } from "./menu-item";
import { useId, useMergeRefs } from "@pras-ui/core";
import { createContextScope } from "@pras-ui/core";

type ChoiceItemContextType = {
  value: string;
  isSelected: boolean;
};

export const [
  MenuChoiceItemProvider,
  useMenuChoiceItemContext,
  createMenuChoiceItemScope,
] = createContextScope<ChoiceItemContextType>("MenuChoiceItem", []);

type MenuChoiceItemProps = Omit<
  React.ComponentProps<typeof MenuItem>,
  "closeOnSelect"
> & {
  value: string;
  children: React.ReactNode;
};

export const MenuChoiceItem = React.forwardRef<
  React.ComponentRef<typeof MenuItem>,
  MenuChoiceItemProps
>(({ value, children, onClick, ...props }, forwardedRef) => {
  const context = useChoiceContext();
  const ref = React.useRef<HTMLLIElement>(null);
  const mergedRef = useMergeRefs(ref, forwardedRef);

  const isSelected =
    context.mode === "single"
      ? context.value === value
      : (context.value as string[]).includes(value);

  const handleClick = (e: MenuItemClickEvent) => {
    e.preventDefaultPlus();
    const current = context.value;
    if (context.mode === "single") {
      if (current !== value) context.onChange(value);
    } else {
      const next = (current as string[]).includes(value)
        ? (current as string[]).filter((v) => v !== value)
        : [...(current as string[]), value];
      context.onChange(next);
    }
    onClick?.(e);
  };

  return (
    <MenuChoiceItemProvider scopeId={useId()} value={{ value, isSelected }}>
      <MenuItem
        ref={mergedRef}
        data-state={isSelected ? "selected" : "unselected"}
        onClick={handleClick}
        aria-selected={isSelected}
        role="option"
        tabIndex={0}
        {...props}
      >
        {children}
      </MenuItem>
    </MenuChoiceItemProvider>
  );
});
