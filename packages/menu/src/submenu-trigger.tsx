import {
  ComponentPropsWithoutInternalProps,
  composeEventHandlers,
} from "@pras-ui/core";
import { MenuItem } from "./menu-item";
import { useSubMenuContext } from "./submenu-root";
import * as React from "react";

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
  const { setOpen, open, openStrategy, delay, __scopeId } = useSubMenuContext();
  const isOpenOnHover = openStrategy === "hover" || openStrategy === "both";
  const isOpenOnClick = openStrategy === "click" || openStrategy === "both";
  const timerRef = React.useRef<number | null>(null);

  const handleClearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => handleClearTimer();
  }, []);

  return (
    <MenuItem
      data-sub-trigger-id={__scopeId}
      id={`sub-trigger-${__scopeId}`}
      aria-controls={`sub-content-${__scopeId}`}
      aria-haspopup="true"
      aria-expanded={open}
      onMouseLeave={composeEventHandlers(onMouseLeave, () => {
        if (isOpenOnHover) {
          handleClearTimer();
          setOpen(false);
        }
      })}
      data-state={open ? "opened" : "closed"}
      onMouseEnter={composeEventHandlers(onMouseEnter, () => {
        if (isOpenOnHover) {
          handleClearTimer();
          timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, delay);
        }
      })}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={composeEventHandlers(onClick, (e) => {
        e.stopPropagation();
        e.preventDefaultPlus();
        if (isOpenOnClick) {
          handleClearTimer();
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
