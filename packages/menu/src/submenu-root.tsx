import { createContextScope, useControllableState, useId } from "@pras-ui/core";

type SubMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openStrategy?: "hover" | "click" | "both";
  delay: number;
};

export const [SubMenuProvider, useSubMenuContext, createSubMenuScope] =
  createContextScope<SubMenuContextType>("SubMenu");

/* ------------------------------------------------------------------------------------
 * SubMenuRoot
 * ----------------------------------------------------------------------------------*/
interface SubMenuRootProps {
  children: React.ReactNode;

  /**
   * Controls the open state of the submenu externally.
   * If provided, the component becomes controlled.
   */
  open?: boolean;

  /**
   * The initial open state of the submenu if uncontrolled.
   * Ignored if `open` prop is provided.
   */
  defaultOpen?: boolean;

  /**
   * Callback fired when the submenu's open state changes.
   * Useful for syncing state with external components or logic.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Determines how the submenu should be triggered open:
   * - `"hover"`: opens on mouse hover.
   * - `"click"`: opens on mouse click.
   * - `"both"`: allows both hover and click to open the submenu.
   *
   * @default "both"
   */
  openStrategy?: "hover" | "click" | "both";

  /**
   * The delay in milliseconds before the submenu opens on hover.
   * @default 0
   */
  delay?: number;
}
export const SubMenuRoot = ({
  children,
  defaultOpen,
  onOpenChange,
  open: openProp,
  openStrategy = "both",
  delay = 0,
}: SubMenuRootProps) => {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  return (
    <SubMenuProvider
      scopeId={useId()}
      value={{
        open,
        setOpen,
        openStrategy,
        delay,
      }}
    >
      {children}
    </SubMenuProvider>
  );
};
