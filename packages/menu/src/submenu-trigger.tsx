import {
  ComponentPropsWithoutInternalProps,
  composeEventHandlers,
} from "@pras-ui/crux";
import { MenuItem } from "./menu-item";
import { useSubMenuContext } from "./submenu-root";
import React from "react";

/* ------------------------------------------------------------------------------------
 * SubMenuTrigger
 * ----------------------------------------------------------------------------------*/
interface SubMenuTriggerProps
  extends ComponentPropsWithoutInternalProps<typeof MenuItem> {
  children: React.ReactNode;
}
export const SubMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof MenuItem>,
  SubMenuTriggerProps
>(({ onClick, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { setOpen, open, openStrategy, __scopeId } = useSubMenuContext();
  const isOpenOnHover = openStrategy === "hover" || openStrategy === "both";
  const isOpenOnClick = openStrategy === "click" || openStrategy === "both";

  return (
    <MenuItem
      data-sub-menu-trigger={__scopeId}
      onMouseLeave={composeEventHandlers(
        onMouseLeave,
        () => isOpenOnHover && setOpen(false)
      )}
      onMouseEnter={composeEventHandlers(
        onMouseEnter,
        () => isOpenOnHover && setOpen(true)
      )}
      onClick={composeEventHandlers(onClick, (e) => {
        e.preventDefaultPlus();
        if (isOpenOnClick) {
          setOpen(!open);
        } else {
          setOpen(true);
        }
      })}
      ref={ref}
      {...props}
    />
  );
});
