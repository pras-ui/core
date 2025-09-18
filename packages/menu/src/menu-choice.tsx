import { createContextScope } from "@pras-ui/core";
import { Element } from "@pras-ui/slot";
import * as React from "react";
import { useId } from "@pras-ui/core";
import { GroupProvider } from "./menu-group";

/* ------------------------------------------------------------------------------------
 * Choice Context
 * ----------------------------------------------------------------------------------*/
type Mode = "single" | "multiple";

type ChoiceContextType<T extends Mode = Mode> = {
  mode: T;
  value: T extends "single" ? string : string[];
  onChange: (value: T extends "single" ? string : string[]) => void;
};

export const [ChoiceProvider, useChoiceContext, createChoiceScope] =
  createContextScope<ChoiceContextType>("MenuChoice", []);

/* ------------------------------------------------------------------------------------
 * MenuChoice
 * ----------------------------------------------------------------------------------*/
type MenuChoiceProps<T extends Mode> = React.ComponentProps<
  typeof Element.div
> & {
  mode: T;
  defaultValue?: T extends "single" ? string : string[];
  onChange: (value: T extends "single" ? string : string[]) => void;
};

export const MenuChoice = React.forwardRef<
  React.ComponentRef<typeof Element.div>,
  MenuChoiceProps<Mode>
>(({ mode = "single", defaultValue, onChange, ...props }, ref) => {
  const [value, setValue] = React.useState<string | string[]>(
    defaultValue ?? (mode === "single" ? "" : [])
  );
  const groupId = useId("group");
  const labelId = useId("label");

  const handleChange = (newValue: string | string[]) => {
    setValue(newValue);
    onChange(newValue as any);
  };

  return (
    <GroupProvider scopeId={useId()} value={{ groupId, labelId }}>
      <ChoiceProvider
        scopeId={useId()}
        value={{ mode, value, onChange: handleChange }}
      >
        <Element.div
          role="choicegroup"
          id={groupId}
          aria-labelledby={labelId}
          ref={ref}
          {...props}
        />
      </ChoiceProvider>
    </GroupProvider>
  );
});

MenuChoice.displayName = "MenuChoice";
