import { MenuChoice } from "@pras-ui/menu";
import * as React from "react";

/* ------------------------------------------------------------------------------------
 * PopupMenu Choice
 * ----------------------------------------------------------------------------------*/
type PopupMenuChoiceProps = React.ComponentProps<typeof MenuChoice>;

export const PopupMenuChoice = React.forwardRef<
  React.ComponentRef<typeof MenuChoice>,
  PopupMenuChoiceProps
>(({ ...props }, ref) => {
  return <MenuChoice ref={ref} {...props} />;
});

PopupMenuChoice.displayName = "PopupMenuChoice";
