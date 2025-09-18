import { Element } from "@pras-ui/slot";
import * as React from "react";
import { useMenuChoiceItemContext } from "./menu-choice-item";
/* 
------------------------------------------------------------------------------------
 * Menu Choice Indicator
 * ----------------------------------------------------------------------------------*/
interface MenuChoiceIndicatorProps
  extends React.ComponentProps<typeof Element.span> {}

export const MenuChoiceIndicator = React.forwardRef<
  React.ComponentRef<typeof Element.span>,
  MenuChoiceIndicatorProps
>(({ ...props }, ref) => {
  const context = useMenuChoiceItemContext();
  return (
    <Element.span
      role="menuchoiceindicator"
      ref={ref}
      data-state={context.isSelected ? "selected" : "unselected"}
      aria-selected={context.isSelected}
      {...props}
    />
  );
});

MenuChoiceIndicator.displayName = "MenuChoiceIndicator";
