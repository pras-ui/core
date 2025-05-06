import * as React from "react";
import { useMergeRefs } from "@pras-ui/crux";
import * as UiCore from "@pras-ui/crux";
import { MenuContent } from "./menu-content";
import { useSubMenuContext } from "./submenu-root";
import { __submenuSetOpenSymbol__ } from "./menu-root";

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
>(({ onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { setOpen, __scopeId } = useSubMenuContext();

  const localRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(ref, localRef);

  React.useEffect(() => {
    if (!localRef.current) return;

    (localRef.current as any)[__submenuSetOpenSymbol__] = setOpen;
  }, [setOpen]);

  return (
    <MenuContent
      onMouseEnter={UiCore.composeEventHandlers(onMouseEnter, () =>
        setOpen(true)
      )}
      onMouseLeave={UiCore.composeEventHandlers(onMouseLeave, () =>
        setOpen(false)
      )}
      data-sub-menu={__scopeId}
      ref={mergedRef}
      {...props}
    />
  );
});
