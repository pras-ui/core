import * as React from "react";
import { Element } from "@pras-ui/slot";
import {
  ComponentPropsWithoutInternalProps,
  TypeCompose,
  useMergeRefs,
} from "@pras-ui/core";
import {
  useFloatingContext,
  FloatingContent,
  shouldMount,
} from "@pras-ui/floating-kit";
import { MenuContent, useMenuContext } from "@pras-ui/menu";
import { usePresence } from "@pras-ui/presence";
import { useDirection } from "@pras-ui/direction";

/* ------------------------------------------------------------------------------------
 * PopupMenu Content
 * ----------------------------------------------------------------------------------*/
type PopupMenuContentProps = TypeCompose<
  [
    Omit<
      ComponentPropsWithoutInternalProps<typeof FloatingContent>,
      | "alignOffset"
      | "isPresent"
      | "updatePositionFrequency"
      | keyof React.ComponentProps<typeof Element.div>
    >,
    Omit<
      ComponentPropsWithoutInternalProps<typeof MenuContent>,
      "closeOnOutsideClick" | keyof React.ComponentProps<typeof Element.div>
    >,
    Omit<ComponentPropsWithoutInternalProps<typeof Element.div>, "asChild">
  ]
> & {};

export const PopupMenuContent = React.forwardRef<
  HTMLElement,
  PopupMenuContentProps
>(
  (
    {
      // MenuProps
      loop,
      navigationDown,
      navigationUp,
      onEsc,
      onOutsideInteraction,

      // FloatingProps
      align = "start",
      side = "bottom",
      sideOffset,
      alwaysRender,
      autoHideOnDetach,
      avoidCollisions,
      collisionBoundary,
      collisionPadding,
      position,
      removeScroll,
      sticky,
      ...props
    },
    forwardRef
  ) => {
    const { open } = useMenuContext();
    const localRef = React.useRef<HTMLElement>(null);
    const { isPresent, ref: presenceRef } = usePresence(open);
    const dir = useDirection();

    const { alwaysRender: globalAlwaysRenderState } = useFloatingContext();

    if (
      !shouldMount({
        isPresent,
        alwaysRender,
        globalAlwaysRender: globalAlwaysRenderState,
      })
    )
      return null;

    return (
      <FloatingContent
        ref={useMergeRefs(localRef, forwardRef)}
        removeScroll={removeScroll}
        autoHideOnDetach={autoHideOnDetach}
        sideOffset={sideOffset}
        side={side}
        dir={dir}
        isPresent={isPresent}
        collisionPadding={collisionPadding}
        align={align}
        avoidCollisions={avoidCollisions}
        updatePositionFrequency="rapid"
        alwaysRender={alwaysRender}
        collisionBoundary={collisionBoundary}
        position={position}
        sticky={sticky}
      >
        <MenuContent
          navigationDown={navigationDown}
          navigationUp={navigationUp}
          loop={loop}
          closeOnOutsideClick={true}
          onEsc={onEsc}
          dir={dir}
          onOutsideInteraction={onOutsideInteraction}
        >
          <Element.div
            ref={presenceRef}
            data-state={open ? "opened" : "closed"}
            {...props}
          />
        </MenuContent>
      </FloatingContent>
    );
  }
);

PopupMenuContent.displayName = "PopupMenuContent";
