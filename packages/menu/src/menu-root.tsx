import { createContextScope, useControllableState } from "@pras-ui/core";
import { useId } from "@pras-ui/core";
import { DirectionProvider } from "@pras-ui/direction";

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
  dir?: "ltr" | "rtl";
}

export const MenuRoot = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  dir,
}: MenuRootProps) => {
  const [openState, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  return (
    <DirectionProvider dir={dir}>
      <MenuProvider scopeId={useId()} value={{ open: openState, setOpen }}>
        {children}
      </MenuProvider>
    </DirectionProvider>
  );
};

MenuRoot.displayName = "MenuRoot";
