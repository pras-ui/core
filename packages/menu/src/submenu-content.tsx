import * as React from "react";
import { useMergeRefs } from "@pras-ui/core";
import * as UiCore from "@pras-ui/core";
import { MenuContent } from "./menu-content";
import { useSubMenuContext } from "./submenu-root";
import { __submenuSetOpenSymbol__, MenuProvider } from "./menu-root";

/* ------------------------------------------------------------------------------------
 * SubMenuContent
 * ----------------------------------------------------------------------------------*/
interface SubMenuContentProps
  extends UiCore.ComponentPropsWithoutInternalProps<typeof MenuContent> {
  children?: React.ReactNode;
}
export const SubMenuContent = React.forwardRef<
  React.ComponentRef<typeof MenuContent>,
  SubMenuContentProps
>(({ onMouseEnter, onMouseLeave, onMouseDown, ...props }, ref) => {
  const subMenuCtx = useSubMenuContext();

  const localRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(ref, localRef);

  React.useEffect(() => {
    if (!localRef.current) return;

    (localRef.current as any)[__submenuSetOpenSymbol__] = subMenuCtx.setOpen;
  }, [subMenuCtx.setOpen]);

  React.useEffect(() => {
    if (!localRef.current) return;
    const el = localRef.current;

    if (el.hasAttribute("data-content-id"))
      el.removeAttribute("data-content-id");
  }, []);

  return (
    <MenuProvider
      scopeId={subMenuCtx.__scopeId}
      value={{ open: subMenuCtx.open, setOpen: subMenuCtx.setOpen }}
    >
      <MenuContent
        onMouseDown={UiCore.composeEventHandlers(onMouseDown, (e) => {
          e.stopPropagation();
        })}
        onMouseEnter={UiCore.composeEventHandlers(onMouseEnter, () =>
          subMenuCtx.setOpen(true)
        )}
        onMouseLeave={UiCore.composeEventHandlers(onMouseLeave, () =>
          subMenuCtx.setOpen(false)
        )}
        id={`sub-content-${subMenuCtx.__scopeId}`}
        data-sub-content-id={subMenuCtx.__scopeId}
        aria-labelledby={`sub-trigger-${subMenuCtx.__scopeId}`}
        ref={mergedRef as any}
        {...props}
      />
    </MenuProvider>
  );
});

