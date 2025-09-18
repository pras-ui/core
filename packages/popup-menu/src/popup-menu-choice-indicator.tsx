import { MenuChoiceIndicator } from "@pras-ui/menu";
import * as React from "react";

/* ------------------------------------------------------------------------------------
 * PopupMenu Choice Item
 * ----------------------------------------------------------------------------------*/
type PopupMenuChoiceIndicatorProps = React.ComponentProps<
  typeof MenuChoiceIndicator
> & {};

export const PopupMenuChoiceIndicator = React.forwardRef<
  React.ComponentRef<typeof MenuChoiceIndicator>,
  PopupMenuChoiceIndicatorProps
>(({ ...props }, ref) => {
  return <MenuChoiceIndicator ref={ref} {...props} />;
});

PopupMenuChoiceIndicator.displayName = "PopupMenuChoiceIndicator";
