import { ComponentPropsWithoutInternalProps } from "@pras-ui/core";
import { FloatingTrigger } from "@pras-ui/floating-kit";
import { SubMenuTrigger } from "@pras-ui/menu";
import * as React from "react";

/* ------------------------------------------------------------------------------------
 * PopupSubMenu Trigger
 * ----------------------------------------------------------------------------------*/
interface PopupSubMenuTriggerProps
  extends ComponentPropsWithoutInternalProps<typeof SubMenuTrigger> {
  children: React.ReactNode;
}

export const PopupSubMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof SubMenuTrigger>,
  PopupSubMenuTriggerProps
>(({ children, onClick, asChild, ...props }, ref) => {
  return (
    <FloatingTrigger>
      <SubMenuTrigger {...props} ref={ref}>
        {children}
      </SubMenuTrigger>
    </FloatingTrigger>
  );
});

PopupSubMenuTrigger.displayName = "PopupSubMenuTrigger";
