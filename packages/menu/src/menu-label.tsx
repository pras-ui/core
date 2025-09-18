import { Element } from "@pras-ui/slot";
import * as React from "react";
import { useGroupContext } from "./menu-group";
/* ------------------------------------------------------------------------------------
 * Menu Label
 * ----------------------------------------------------------------------------------*/
interface MenuLabelProps extends React.ComponentProps<typeof Element.div> {}

export const MenuLabel = React.forwardRef<
  React.ComponentRef<typeof Element.div>,
  MenuLabelProps
>(({ ...props }, forwardRef) => {
  const { labelId, groupId } = useGroupContext();

  return (
    <Element.div
      id={labelId}
      data-label-for={groupId}
      ref={forwardRef}
      {...props}
    />
  );
});

MenuLabel.displayName = "MenuLabel";
