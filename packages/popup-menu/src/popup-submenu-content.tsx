import * as React from "react";
import { Element } from "@pras-ui/slot";
import { usePresence } from "@pras-ui/presence";
import * as FloatingUi from "@pras-ui/floating-kit";
import * as UiCore from "@pras-ui/core";
import { shouldMount } from "@pras-ui/floating-kit";
import { MenuContent, SubMenuContent, useSubMenuContext } from "@pras-ui/menu";
import { useDirection } from "@pras-ui/direction";

/* ------------------------------------------------------------------------------------
 * PopupSubMenu Content
 * ----------------------------------------------------------------------------------*/
interface PopupSubMenuContentProps
  extends UiCore.TypeCompose<
    [
      Omit<
        UiCore.ComponentPropsWithoutInternalProps<
          typeof FloatingUi.FloatingContent
        >,
        | "alignOffset"
        | "isPresent"
        | "updatePositionFrequency"
        | keyof React.ComponentProps<typeof Element.div>
      >,
      Omit<
        UiCore.ComponentPropsWithoutInternalProps<typeof MenuContent>,
        "closeOnOutsideClick" | keyof React.ComponentProps<typeof Element.div>
      >,
      UiCore.ComponentPropsWithoutInternalProps<typeof Element.div>
    ]
  > {}

export const PopupSubMenuContent = React.forwardRef<
  HTMLElement,
  PopupSubMenuContentProps
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
      align = "center",
      side = "auto",
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
    ref
  ) => {
    const { open } = useSubMenuContext();
    const localRef = React.useRef<HTMLElement>(null);
    const dir = useDirection();

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
        ref={UiCore.useMergeRefs(localRef, ref)}
        removeScroll={removeScroll}
        autoHideOnDetach={autoHideOnDetach}
        sideOffset={sideOffset}
        side={side}
        dir={dir}
        isPresent={isPresent}
        collisionPadding={collisionPadding}
        align={align}
        avoidCollisions={avoidCollisions}
        updatePositionFrequency="lazy"
        alwaysRender={alwaysRender}
        collisionBoundary={collisionBoundary}
        position={position}
        sticky={sticky}
      >
        <SubMenuContent
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
          ></Element.div>
        </SubMenuContent>
      </FloatingUi.FloatingContent>
    );
  }
);

PopupSubMenuContent.displayName = "PopupSubMenuContent";
