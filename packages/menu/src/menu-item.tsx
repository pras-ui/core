import { Element } from "@pras-ui/slot";
import React from "react";
import { SubmenuRegistry } from "./submenu-registry";
import { useMenuContext } from "./menu-root";
import {
  ComponentPropsWithoutInternalProps,
  composeEventHandlers,
  useMergeRefs,
} from "@pras-ui/core";

/* ------------------------------------------------------------------------------------
 * MenuItem
 * ----------------------------------------------------------------------------------*/
interface MenuItemProps
  extends ComponentPropsWithoutInternalProps<typeof Element.button> {
  /**
   * The content to display inside the menu item.
   */
  children: React.ReactNode;

  /**
   * Controls whether the menu should automatically close after this item is clicked.
   *
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Click handler with extended event helpers.
   */
  onClick?: (e: MenuItemClickEvent) => void;
}

export type MenuItemClickEvent = React.MouseEvent<HTMLButtonElement> & {
  /**
   * Manually control the open state of the menu.
   *
   * - `undefined` or `true`: Closes the menu.
   * - `false`: Keeps the menu open.
   */
  closeMenu: (close?: boolean) => void;

  /**
   * Prevents both default event behavior `e.preventDefault()`
   * and `pras-ui` core default `onClick` behavior.
   */
  preventDefaultPlus: () => void;
};

export const MenuItem = React.forwardRef<
  React.ComponentRef<typeof Element.button>,
  MenuItemProps
>(
  (
    {
      children,
      onClick,
      disabled = false,
      onMouseEnter,
      closeOnSelect = true,
      ...props
    },
    forwardRef
  ) => {
    const { setOpen } = useMenuContext();
    const ref = React.useRef<HTMLButtonElement>(null);

    return (
      <Element.button
        ref={useMergeRefs(ref, forwardRef)}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        data-disabled={disabled ? "" : undefined}
        onMouseEnter={composeEventHandlers(onMouseEnter, () => {
          SubmenuRegistry.closeLast();
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        })}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();

          let shouldPreventClose = false;

          const enhancedEvent = Object.assign(e, {
            closeMenu: (close?: boolean) => {
              setOpen(close === undefined ? false : !close);
            },
            preventDefaultPlus: () => {
              e.preventDefault();
              shouldPreventClose = true;
            },
          }) as MenuItemClickEvent;

          // user onclick logic
          onClick?.(enhancedEvent);

          // component specific onclick default logic
          if (closeOnSelect && !shouldPreventClose) {
            setOpen(false);
          }
        }}
        {...props}
      >
        {children}
      </Element.button>
    );
  }
);
