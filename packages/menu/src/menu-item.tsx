import { Element } from "@pras-ui/slot";
import React from "react";
import { submenuRegistry } from "./submenuRegistry";
import { useMenuContext } from "./menu-root";
import {
  ComponentPropsWithoutInternalProps,
  composeEventHandlers,
} from "@pras-ui/crux";

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

type MenuItemClickEvent = React.MouseEvent<HTMLButtonElement> & {
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
    ref
  ) => {
    const { setOpen } = useMenuContext();

    return (
      <Element.button
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        data-disabled={disabled ? "" : undefined}
        data-state="item"
        onMouseEnter={composeEventHandlers(onMouseEnter, () => {
          submenuRegistry.closeLast();
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        })}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
