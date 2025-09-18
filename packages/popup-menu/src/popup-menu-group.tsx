import { MenuGroup } from "@pras-ui/menu";
import * as React from "react";

/* ------------------------------------------------------------------------------------
 * PopupMenu Group
 * ----------------------------------------------------------------------------------*/
interface PopupMenuGroupProps extends React.ComponentProps<typeof MenuGroup> {}

export const PopupMenuGroup = React.forwardRef<
  React.ComponentRef<typeof MenuGroup>,
  PopupMenuGroupProps
>(({ ...props }, ref) => {
  return <MenuGroup ref={ref} {...props} />;
});

PopupMenuGroup.displayName = "PopupMenuGroup";
