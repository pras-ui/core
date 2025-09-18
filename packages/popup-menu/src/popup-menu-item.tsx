import { MenuItem } from "@pras-ui/menu";
import * as React from "react";

/* ------------------------------------------------------------------------------------
 * PopupMenu Item
 * ----------------------------------------------------------------------------------*/
interface PopupMenuItemProps extends React.ComponentProps<typeof MenuItem> {}

export const PopupMenuItem = React.forwardRef<
  React.ComponentRef<typeof MenuItem>,
  PopupMenuItemProps
>(({ ...props }, ref) => {
  return <MenuItem ref={ref} {...props} />;
});

PopupMenuItem.displayName = "PopupMenuItem";
