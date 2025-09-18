import { ComponentPropsWithoutInternalProps } from "@pras-ui/core";
import { useMenuContext } from "@pras-ui/menu";
import * as SharedUI from "@pras-ui/shared-ui";
import * as React from "react";
import { usePopupMenuContext } from "./popup-menu-root";
import { FloatingTrigger } from "@pras-ui/floating-kit";
import { MenuTrigger } from "@pras-ui/menu";
/* ------------------------------------------------------------------------------------
 * PopupMenu Trigger
 * ----------------------------------------------------------------------------------*/
interface PopupMenuTriggerProps
  extends ComponentPropsWithoutInternalProps<typeof SharedUI.Trigger> {
  children: React.ReactNode;
}

export const PopupMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof SharedUI.Trigger>,
  PopupMenuTriggerProps
>(({ children, onClick, onContextMenu, ...props }, ref) => {
  const { setOpen } = useMenuContext();
  const { mode } = usePopupMenuContext();

  const cursorPosition = React.useRef({ x: 0, y: 0 });
  const virtualAnchor = React.useRef({
    getBoundingClientRect: () => {
      const { x, y } = cursorPosition.current;
      return DOMRect.fromRect({
        width: 0,
        height: 0,
        x: x,
        y: y,
      });
    },
  });

  const handleOpening = (e: React.MouseEvent, fn?: Function) => {
    const { clientX, clientY } = e;
    cursorPosition.current = { x: clientX, y: clientY };
    setOpen(true);
    fn?.(e);
  };

  const onTriggerFired =
    mode === "context"
      ? {
          onContextMenu: (e: React.MouseEvent) => {
            e.preventDefault();
            handleOpening(e, onContextMenu);
          },
        }
      : {
          onClick: (e: React.MouseEvent) => handleOpening(e, onClick),
        };

  return (
    <FloatingTrigger virtualTrigger={virtualAnchor as any}>
      <MenuTrigger>
        <SharedUI.Trigger ref={ref} {...onTriggerFired} {...props}>
          {children}
        </SharedUI.Trigger>
      </MenuTrigger>
    </FloatingTrigger>
  );
});

PopupMenuTrigger.displayName = "PopupMenuTrigger";
