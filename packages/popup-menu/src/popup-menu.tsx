import * as React from "react";
import { Element } from "@pras-ui/slot";
import { usePresence } from "@pras-ui/presence";
import * as FloatingUi from "@pras-ui/floating-kit";
import * as SharedUI from "@pras-ui/shared-ui";
import * as UiCore from "@pras-ui/crux";
import { shouldMount } from "@pras-ui/floating-kit";
import { useKeybindy } from "@keybindy/react";
import {
  createMenuScope,
  MenuContent,
  MenuItem,
  MenuRoot,
  SubMenuContent,
  SubMenuRoot,
  SubMenuTrigger,
  useMenuContext,
  useSubMenuContext,
} from "@pras-ui/menu";

type PopupMenuContextValue = {};

const [PopupMenuProvider, usePopupMenuContext] =
  UiCore.createContextScope<PopupMenuContextValue>("PopupMenu", [
    FloatingUi.createFloatingScope,
    createMenuScope,
  ]);

// ---------------- Root ----------------
type PopupMenuProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const PopupMenuRoot = ({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: PopupMenuProps) => {
  return (
    <PopupMenuProvider scopeId={UiCore.useId()} value={{}}>
      <MenuRoot
        open={openProp}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <FloatingUi.FloatingRoot>{children}</FloatingUi.FloatingRoot>
      </MenuRoot>
    </PopupMenuProvider>
  );
};

PopupMenuRoot.displayName = "PopupMenuRoot";

// ---------------- Trigger ----------------
interface PopupMenuTriggerProps
  extends UiCore.ComponentPropsWithoutInternalProps<typeof SharedUI.Trigger> {
  children: React.ReactNode;
}

export const PopupMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof SharedUI.Trigger>,
  PopupMenuTriggerProps
>(({ children, onClick, asChild, ...props }, ref) => {
  const { open, setOpen } = useMenuContext();

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

  return (
    <FloatingUi.FloatingAnchor virtualAnchor={virtualAnchor as any}>
      <SharedUI.Trigger
        data-state={open ? "open" : "closed"}
        onClick={(e) => {
          const { clientX, clientY } = e;

          cursorPosition.current = { x: clientX, y: clientY };

          setOpen(true);
          onClick?.(e);
        }}
        asChild={asChild}
        {...props}
        ref={ref}
      >
        {children}
      </SharedUI.Trigger>
    </FloatingUi.FloatingAnchor>
  );
});

PopupMenuTrigger.displayName = "PopupMenuTrigger";

// ---------------- Content ----------------
interface PopupMenuContentProps
  extends UiCore.ComponentPropsWithoutInternalProps<typeof Element.div> {
  children?: React.ReactNode;
  collisionPadding?:
    | number
    | Record<"top" | "right" | "bottom" | "left", number>;
  alwaysRender?: boolean;
  side?: FloatingUi.Side;
  align?: FloatingUi.Align;
  autoHideOnDetach?: boolean;
}

export const PopupMenuContent = React.forwardRef<
  HTMLElement,
  PopupMenuContentProps
>(
  (
    {
      children,
      style,
      alwaysRender = false,
      collisionPadding,
      side = "bottom",
      align = "end",
      autoHideOnDetach = false,
      ...props
    },
    ref
  ) => {
    const { open, setOpen } = useMenuContext();
    const localRef = React.useRef<HTMLElement>(null);
    const shortcut = useKeybindy();

    React.useEffect(() => {
      if (!open) return;

      const handleClickOutside = (e: MouseEvent) => {
        // Close the menu if the click is outside and not yet recalculated
        if (localRef.current && !localRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [open, setOpen]);

    const { isPresent, ref: presenceRef } = usePresence(open);

    const { alwaysRender: globalAlwaysRenderState } =
      FloatingUi.useFloatingContext();

    if (
      !shouldMount({
        isPresent,
        alwaysRender,
        globalAlwaysRender: globalAlwaysRenderState,
      })
    )
      return null;

    return (
      <FloatingUi.FloatingContent
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        removeScroll={false}
        autoHideOnDetach
        arrowPadding={50}
        side={"bottom"}
        isPresent={isPresent}
        collisionPadding={collisionPadding}
        align="start"
        avoidCollisions
        updatePositionFrequency="rapid"
        alwaysRender={alwaysRender}
      >
        <MenuContent>
          <Element.div
            asChild
            role="menu"
            ref={presenceRef}
            tabIndex={-1}
            data-state={open ? "open" : "closed"}
            {...props}
          >
            <div>{children}</div>
          </Element.div>
        </MenuContent>
      </FloatingUi.FloatingContent>
    );
  }
);

PopupMenuContent.displayName = "PopupMenuContent";

// ---------------- Item ----------------

interface PopupMenuItemProps extends React.ComponentProps<typeof MenuItem> {}

export const PopupMenuItem = React.forwardRef<
  React.ComponentRef<typeof MenuItem>,
  PopupMenuItemProps
>(({ ...props }, ref) => {
  return <MenuItem ref={ref} {...props} />;
});

PopupMenuItem.displayName = "PopupMenuItem";

export const PopupMenuPortal: typeof FloatingUi.FloatingPortal =
  FloatingUi.FloatingPortal;

export const PopupSubMenuRoot: React.FC<
  React.ComponentProps<typeof MenuRoot>
> = ({ children, ...props }) => {
  return (
    <SubMenuRoot {...props}>
      <FloatingUi.FloatingRoot>{children}</FloatingUi.FloatingRoot>
    </SubMenuRoot>
  );
};
// ---------------- Trigger ----------------
interface PopupSubMenuTriggerProps
  extends UiCore.ComponentPropsWithoutInternalProps<typeof SharedUI.Trigger> {
  children: React.ReactNode;
}

export const PopupSubMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof SharedUI.Trigger>,
  PopupSubMenuTriggerProps
>(({ children, onClick, asChild, ...props }, ref) => {
  return (
    <FloatingUi.FloatingAnchor>
      <SubMenuTrigger {...props} ref={ref}>
        {children}
      </SubMenuTrigger>
    </FloatingUi.FloatingAnchor>
  );
});

PopupMenuTrigger.displayName = "PopupMenuTrigger";

// ---------------- Content ----------------
interface PopupSubMenuContentProps
  extends UiCore.ComponentPropsWithoutInternalProps<
    typeof FloatingUi.FloatingContent
  > {}

export const PopupSubMenuContent = React.forwardRef<
  HTMLElement,
  PopupSubMenuContentProps
>(
  (
    {
      children,
      style,
      alwaysRender = false,

      ...props
    },
    ref
  ) => {
    const { open } = useSubMenuContext();
    const localRef = React.useRef<HTMLElement>(null);

    const { isPresent, ref: presenceRef } = usePresence(open);

    const { alwaysRender: globalAlwaysRenderState } =
      FloatingUi.useFloatingContext();

    if (
      !shouldMount({
        isPresent,
        alwaysRender,
        globalAlwaysRender: globalAlwaysRenderState,
      })
    )
      return null;

    return (
      <FloatingUi.FloatingContent
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        removeScroll={true}
        side={"right"}
        align="center"
        isPresent={isPresent}
        alwaysRender={alwaysRender}
      >
        <SubMenuContent>
          <Element.div
            asChild
            role="menu"
            ref={presenceRef}
            tabIndex={-1}
            data-state={open ? "open" : "closed"}
            {...props}
          >
            <div>{children}</div>
          </Element.div>
        </SubMenuContent>
      </FloatingUi.FloatingContent>
    );
  }
);

PopupSubMenuContent.displayName = "PopupSubMenuContent";
