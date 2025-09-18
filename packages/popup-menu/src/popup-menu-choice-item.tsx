import { MenuChoiceItem } from "@pras-ui/menu";
import * as React from "react";

/* ------------------------------------------------------------------------------------
 * PopupMenu Choice Item
 * ----------------------------------------------------------------------------------*/
type PopupMenuChoiceItemProps = React.ComponentProps<
  typeof MenuChoiceItem
> & {};

export const PopupMenuChoiceItem = React.forwardRef<
  React.ComponentRef<typeof MenuChoiceItem>,
  PopupMenuChoiceItemProps
>(({ ...props }, ref) => {
  return <MenuChoiceItem ref={ref} {...props} />;
});

PopupMenuChoiceItem.displayName = "PopupMenuChoiceItem";
