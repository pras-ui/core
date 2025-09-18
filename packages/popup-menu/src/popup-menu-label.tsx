import { MenuLabel } from "@pras-ui/menu";
import * as React from "react";

/* ------------------------------------------------------------------------------------
 * PopupMenu Label
 * ----------------------------------------------------------------------------------*/
interface PopupMenuLabelProps extends React.ComponentProps<typeof MenuLabel> {}

export const PopupMenuLabel = React.forwardRef<
  React.ComponentRef<typeof MenuLabel>,
  PopupMenuLabelProps
>(({ ...props }, ref) => {
  return <MenuLabel ref={ref} {...props} />;
});

PopupMenuLabel.displayName = "PopupMenuLabel";
