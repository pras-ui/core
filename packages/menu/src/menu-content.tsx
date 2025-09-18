import { type Keys, useKeybindy } from "@keybindy/react";
import { useId, useMergeRefs } from "@pras-ui/core";
import { Element, Slot } from "@pras-ui/slot";
import * as React from "react";
import { __submenuSetOpenSymbol__, useMenuContext } from "./menu-root";
import { SubmenuRegistry } from "./submenu-registry";

/**
 * Merges one-dimensional or two-dimensional arrays of keys into a single 2D array.
 * Empty arrays are ignored from the result.
 *
 * @param a - First input array of keys (either 1D or 2D)
 * @param b - Second input array of keys (either 1D or 2D)
 * @returns A merged 2D array with empty inputs removed
 *
 * @internal_use_only
 */
export const mergeKeys = (
  a: Keys[] | Keys[][],
  b: Keys[] | Keys[][]
): Keys[][] => {
  const is2D = (x: Keys[] | Keys[][]): x is Keys[][] => Array.isArray(x[0]);
  const isEmpty = (x: Keys[] | Keys[][]): boolean =>
    Array.isArray(x) && x.length === 0;

  if (isEmpty(a) && isEmpty(b)) return [];

  if (isEmpty(a)) return is2D(b) ? b : [b];
  if (isEmpty(b)) return is2D(a) ? a : [a];

  if (!is2D(a) && !is2D(b)) return [a, b];
  if (is2D(a) && !is2D(b)) return [...a, b] as Keys[][];
  if (!is2D(a) && is2D(b)) return [a, ...b] as Keys[][];

  return [...a, ...b] as Keys[][];
};

/**
 * Handles submenu entrance by simulating a click on the active element.
 *
 * @internal_use_only
 */
const handleSubmenuEntrance = () => {
  const active = document.activeElement as HTMLElement;

  if (active.hasAttribute("data-sub-trigger-id")) {
    active.click();

    requestAnimationFrame(() => {
      const subMenu = document.querySelector(
        `[data-sub-content-id][data-keybindy-scope]`
      ) as HTMLElement | null;

      if (subMenu) {
        const focusables = Array.from(
          subMenu.querySelectorAll(
            '[role="menuitem"], [role="option"]:not([aria-disabled="true"])'
          )
        ) as HTMLElement[];

        SubmenuRegistry.store(
          active,
          (subMenu as any)[__submenuSetOpenSymbol__]
        );

        focusables[0]?.focus();
      }
    });
  }
};

/* ------------------------------------------------------------------------------------
 * MenuContent
 * ----------------------------------------------------------------------------------*/

type EscapeHandler = KeyboardEvent & {
  preventDefaultPlus: () => void;
  closeMenu: (shouldClose?: boolean) => void;
  lastActive: Element | undefined;
};

type OutsideInteractionHandler = EscapeHandler;

type MenuContentProps = React.ComponentProps<typeof Element.div> & {
  /**
   * Enables looping keyboard navigation within the menu items.
   *
   * When set to true:
   * - Pressing ArrowDown on the last item will move focus to the first item.
   * - Pressing ArrowUp on the first item will move focus to the last item.
   *
   * When false, navigation will stop at the first and last items.
   *
   * @default true
   */
  loop?: boolean;

  /**
   * Custom key(s) to trigger upward navigation through menu items.
   *
   * @Supports
   * - A single combination: ['ArrowUp'] or ['W']
   * - Multiple alternatives: [['W'], ['8']] (both 'W' and '8' keys work)
   *
   * @default ArrowUp
   */
  navigationUp?: Keys[] | Keys[][];

  /**
   * Custom key(s) to trigger downward navigation through menu items.
   *
   * @Supports
   * - A single combination: ['ArrowDown'] or ['S']
   * - Multiple alternatives: [['S'], ['2']] (both 'S' and '2' keys work)
   *
   * @default ArrowDown
   */
  navigationDown?: Keys[] | Keys[][];

  onEsc?: (e: EscapeHandler) => void;

  onOutsideInteraction?: (e: OutsideInteractionHandler) => void;

  /**
   * Direction of the menu.
   *
   * @default "ltr"
   * @internal_use_only
   */
  dir?: "ltr" | "rtl";
  /**
   * Closes the menu when clicking outside of it.
   *
   * @default true
   * @internal_use_only
   */
  closeOnOutsideClick?: boolean;
};

export const MenuContent = React.forwardRef<
  React.ComponentRef<typeof Element.div>,
  MenuContentProps
>(
  (
    {
      children,
      style,
      loop = true,
      navigationUp = [],
      navigationDown = [],
      onEsc,
      onOutsideInteraction,
      closeOnOutsideClick = true,
      dir = "ltr",
      ...props
    },
    forwardedRef
  ) => {
    const menuRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(menuRef, forwardedRef);
    const shortcut = useKeybindy();
    const ctx = useMenuContext();
    const scopeId = useId("kbd");

    React.useEffect(() => {
      if (!ctx.open || !closeOnOutsideClick) return;

      const handleClickOutside = (e: any) => {
        const menuElement = menuRef.current;

        if (!menuElement || menuElement.contains(e.target as Node)) return; // prevent click inside menu

        let prevented = false;
        let isCloseable = true;
        const menuId = menuElement?.getAttribute("data-content-id");

        const lastActiveElement =
          document.querySelector(`[data-trigger-id="${menuId}"]`) ??
          document.activeElement ??
          undefined;

        const enhancedEvent: OutsideInteractionHandler = Object.assign({}, e, {
          preventDefaultPlus: () => {
            e.preventDefault();
            prevented = true;
          },
          closeMenu: (shouldClose?: boolean) => {
            if (shouldClose === false) {
              return (isCloseable = false);
            }
            ctx.setOpen(false);
          },
          lastActive: lastActiveElement,
        });

        onOutsideInteraction?.(enhancedEvent);

        if (!prevented) {
          if (isCloseable) {
            ctx.setOpen(false);
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [ctx.open, closeOnOutsideClick]);

    React.useEffect(() => {
      if (!menuRef.current) return;
      const menuEl = menuRef.current;

      const isSubMenu = menuEl.hasAttribute("data-sub-content-id");

      const items = Array.from(
        menuEl.querySelectorAll(
          '[role="menuitem"]:not([aria-disabled="true"]), [role="option"]:not([aria-disabled="true"])'
        )
      ) as HTMLElement[];

      const focusItem = (index: number) => {
        if (items[index]) items[index].focus();
      };

      const getCurrentIndex = () =>
        items.findIndex((item) => item === document.activeElement);

      shortcut.register(
        mergeKeys(["Arrow Down"], navigationDown),
        () => {
          const current = getCurrentIndex();
          const next =
            current < items.length - 1 ? current + 1 : loop ? 0 : current;
          focusItem(next);
        },
        { scope: scopeId, preventDefault: true }
      );

      shortcut.register(
        mergeKeys(["Arrow Up"], navigationUp),
        () => {
          const current = getCurrentIndex();
          if (current === -1) {
            focusItem(items.length - 1);
            return;
          }
          const prev = (current - 1 + items.length) % items.length;

          if (!loop && prev === items.length - 1) return;

          focusItem(prev);
        },
        { scope: scopeId, preventDefault: true }
      );

      shortcut.register(
        dir === "ltr" ? [["Arrow Right"]] : [["Arrow Left"]],
        () => {
          handleSubmenuEntrance();
        },
        {
          scope: scopeId,
          preventDefault: true,
        }
      );

      if (isSubMenu) {
        let maybeSetOpen: Function | undefined;

        setTimeout(() => {
          maybeSetOpen = (menuEl as any)[__submenuSetOpenSymbol__];
        }, 0);

        shortcut.register(
          dir === "ltr"
            ? [["Arrow Left"], ["Esc"]]
            : [["Arrow Right"], ["Esc"]],
          (e: KeyboardEvent) => {
            if (typeof maybeSetOpen === "function") {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                const triggerEl = SubmenuRegistry.pop();
                maybeSetOpen(false);
                triggerEl?.focus();
              } else if (e.key === "Escape") {
                const triggerEl = SubmenuRegistry.get();
                let escapePrevented = false;
                let isSubMenuCloseable = true;

                const enhancedEvent: EscapeHandler = Object.assign({}, e, {
                  preventDefaultPlus: () => {
                    e.preventDefault();
                    escapePrevented = true;
                    isSubMenuCloseable = false;
                  },
                  closeMenu: (shouldClose?: boolean) => {
                    if (shouldClose === false) {
                      return (isSubMenuCloseable = false);
                    }
                    isSubMenuCloseable = true;
                  },
                  lastActive: triggerEl,
                });

                onEsc?.(enhancedEvent);

                if (!escapePrevented || isSubMenuCloseable) {
                  SubmenuRegistry.pop();
                  maybeSetOpen(false);
                  triggerEl?.focus();
                }
              }
            }
          },
          { scope: scopeId, preventDefault: true }
        );
      } else {
        shortcut.register(
          [["Esc"]],
          (e: KeyboardEvent) => {
            const menuId = menuEl.getAttribute("data-content-id");
            let escapePrevented = false;
            let isMenuCloseable = true;

            const lastActiveElement =
              document.querySelector(`[data-trigger-id="${menuId}"]`) ??
              document.activeElement ??
              undefined;

            const enhancedEvent: EscapeHandler = Object.assign({}, e, {
              preventDefaultPlus: () => {
                e.preventDefault();
                escapePrevented = true;
              },
              closeMenu: (shouldClose?: boolean) => {
                if (shouldClose === false) {
                  return (isMenuCloseable = false);
                }
                ctx.setOpen(false);
              },
              lastActive: lastActiveElement,
            });

            onEsc?.(enhancedEvent);

            if (!escapePrevented) {
              if (isMenuCloseable) ctx.setOpen(false);
            }
          },
          {
            preventDefault: true,
            scope: scopeId,
          }
        );
      }

      shortcut.register(
        [["Enter"], ["Numpad Enter"]],
        () => {
          const active = document.activeElement as HTMLElement;

          handleSubmenuEntrance();

          active.click();
        },
        { scope: scopeId, preventDefault: true }
      );

      shortcut.register(
        [["Space"]],
        () => {
          const active = document.activeElement as HTMLElement;
          if (active?.getAttribute("role") === "option") {
            active.click();
          }
        },
        {
          scope: scopeId,
          preventDefault: true,
        }
      );

      return () => {
        shortcut.popScope();
        SubmenuRegistry.clear();
      };
    }, [scopeId]);

    return (
      <Slot
        ref={mergedRef}
        data-keybindy-scope={scopeId}
        data-content-id={ctx.__scopeId}
        role="menu"
        aria-label="Menu"
        dir={dir}
        tabIndex={-1}
        {...props}
      >
        {children}
      </Slot>
    );
  }
);

MenuContent.displayName = "MenuContent";
