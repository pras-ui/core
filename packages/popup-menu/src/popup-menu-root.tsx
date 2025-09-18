import * as React from "react";
import { FloatingRoot, createFloatingScope } from "@pras-ui/floating-kit";
import * as UiCore from "@pras-ui/core";
import { createMenuScope, MenuRoot } from "@pras-ui/menu";

/* ------------------------------------------------------------------------------------
 * PopupMenu Context
 * ----------------------------------------------------------------------------------*/

type PopupMenuContextValue = {
  mode: "default" | "context";
};

export const [PopupMenuProvider, usePopupMenuContext] =
  UiCore.createContextScope<PopupMenuContextValue>("PopupMenu", [
    createFloatingScope,
    createMenuScope,
  ]);

/* ------------------------------------------------------------------------------------
 * PopupMenu Root
 * ----------------------------------------------------------------------------------*/
interface PopupMenuProps extends React.ComponentProps<typeof MenuRoot> {
  mode?: "default" | "context";
  shortcuts?: Array<UiCore.ShortcutType>;
}

export const PopupMenuRoot = ({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  mode = "default",
  dir,
  shortcuts,
}: PopupMenuProps) => {
  const scopeId = UiCore.useId();
  return (
   <UiCore.ShortcutProvider scope={scopeId} shortcuts={shortcuts}>
      <PopupMenuProvider scopeId={scopeId} value={{ mode }}>
        <MenuRoot
          dir={dir}
          open={openProp}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          <FloatingRoot>{children}</FloatingRoot>
        </MenuRoot>
      </PopupMenuProvider>
   </UiCore.ShortcutProvider>
  );
};

PopupMenuRoot.displayName = "PopupMenuRoot";
