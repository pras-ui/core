import { useKeybindy } from "@keybindy/react";
import { useId, useMergeRefs } from "@pras-ui/crux";
import { Element, Slot } from "@pras-ui/slot";
import React from "react";
import { __submenuSetOpenSymbol__, useMenuContext } from "./menu-root";
import { submenuRegistry } from "./submenuRegistry";

/* ------------------------------------------------------------------------------------
 * MenuContent
 * ----------------------------------------------------------------------------------*/
interface MenuContentProps extends React.ComponentProps<typeof Element.div> {
  /**
   * Enables or disables looping of keyboard navigation within the menu.
   *
   * When `true`, pressing ArrowDown on the last item will focus the first item,
   * and ArrowUp on the first item will focus the last item.
   *
   * @default true
   */
  loop?: boolean;

  // navigationUp?: Key
}

export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  ({ children, style, loop = true, ...props }, forwardedRef) => {
    const menuRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(menuRef, forwardedRef);
    const shortcut = useKeybindy();
    const ctx = useMenuContext();
    const scopeId = useId("kbd");

    React.useEffect(() => {
      if (!menuRef.current) return;
      const menuEl = menuRef.current;
      const isSubMenu = menuEl.hasAttribute("data-sub-menu");

      const items = Array.from(
        menuEl.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
      ) as HTMLElement[];

      const handleSubmenuEntrance = () => {
        const active = document.activeElement as HTMLElement;
        if (active?.hasAttribute("data-sub-menu-trigger")) {
          active.click();

          requestAnimationFrame(() => {
            const subMenu = document.querySelector(
              "[data-sub-menu][data-keybindy-scope]"
            ) as HTMLElement | null;

            if (subMenu) {
              const focusables = Array.from(
                subMenu.querySelectorAll(
                  '[role="menuitem"]:not([aria-disabled="true"])'
                )
              ) as HTMLElement[];

              submenuRegistry.store(
                active,
                (menuEl as any)[__submenuSetOpenSymbol__]
              );

              focusables[0]?.focus();
            }
          });
        }
      };

      const focusItem = (index: number) => {
        if (items[index]) items[index].focus();
      };

      const getCurrentIndex = () =>
        items.findIndex((item) => item === document.activeElement);

      // 🔐 Register Scoped Keybinds
      shortcut.register(
        [["Arrow Down"], ["Tab"]],
        () => {
          const current = getCurrentIndex();
          const next =
            current < items.length - 1 ? current + 1 : loop ? 0 : current;
          focusItem(next);
        },
        { scope: scopeId, preventDefault: true }
      );

      shortcut.register(
        ["Arrow Up"],
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
        { scope: scopeId }
      );

      shortcut.register([["Arrow Right"]], handleSubmenuEntrance, {
        scope: scopeId,
      });

      // ✅ LEFT: Close submenu and return to trigger
      if (isSubMenu) {
        setTimeout(() => {
          const maybeSetOpen = (menuEl as any)[__submenuSetOpenSymbol__];

          shortcut.register(
            [["Arrow Left"]],
            () => {
              if (typeof maybeSetOpen === "function") {
                maybeSetOpen(false);

                const triggerEl = submenuRegistry.pop();
                triggerEl?.focus();
              }
            },
            { scope: scopeId }
          );
        }, 0);
      } else {
        shortcut.register(
          [["Esc"]],
          () => {
            ctx.setOpen(false);
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

      // Bonus: Optional — prevent Tab and Space from doing default things
      shortcut.register([[], ["Space"]], () => {}, {
        preventDefault: true,
        scope: scopeId,
      });

      // 🧹 Cleanup
      return () => {
        shortcut.popScope();
        submenuRegistry.clear();
      };
    }, [shortcut, ctx, scopeId]);

    return (
      <Slot ref={mergedRef} data-keybindy-scope={scopeId} {...props}>
        {children}
      </Slot>
    );
  }
);

MenuContent.displayName = "MenuContent";
