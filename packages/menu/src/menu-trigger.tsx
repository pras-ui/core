import { ComponentPropsWithoutInternalProps } from "@pras-ui/core";
import * as React from "react";
import { useMenuContext } from "./menu-root";
import { Element, Slot } from "@pras-ui/slot";

/* ------------------------------------------------------------------------------------
 * MenuTrigger
 * ----------------------------------------------------------------------------------*/
interface MenuTriggerProps
  extends ComponentPropsWithoutInternalProps<typeof Element.div> {
  children: React.ReactNode;
}
export const MenuTrigger = React.forwardRef<
  React.ComponentRef<typeof Element.div>,
  MenuTriggerProps
>(({ ...props }, ref) => {
  const { __scopeId, open } = useMenuContext();
  return (
    <Slot
      ref={ref}
      data-state={open ? "opened" : "closed"}
      data-trigger-id={`${__scopeId}`}
      {...props}
    />
  );
});
