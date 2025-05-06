import { createContextScope, useControllableState } from "@pras-ui/crux";
import { useId } from "react";

export const __submenuSetOpenSymbol__ = Symbol("__submenu_set_open__");

/* ------------------------------------------------------------------------------------
 * Menu Context
 * ----------------------------------------------------------------------------------*/

type MenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const [MenuProvider, useMenuContext, createMenuScope] =
  createContextScope<MenuContextType>("Menu");
/* ------------------------------------------------------------------------------------
 * MenuRoot
 * ----------------------------------------------------------------------------------*/
interface MenuRootProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const MenuRoot = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: MenuRootProps) => {
  const [openState, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  return (
    <MenuProvider scopeId={useId()} value={{ open: openState, setOpen }}>
      {children}
    </MenuProvider>
  );
};

MenuRoot.displayName = "MenuRoot";