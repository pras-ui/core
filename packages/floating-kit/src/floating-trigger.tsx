import * as React from "react";
import { useMergeRefs } from "@pras-ui/core";
import { Element, Slot } from "@pras-ui/slot";
import { useFloatingContext } from "./floating-root";

/* ------------------------------------------------------------------------------------
 * FloatingTrigger
 * ----------------------------------------------------------------------------------*/
type FloatingTriggerProps = React.ComponentProps<typeof Element.div> & {
  children?: React.ReactNode;
  virtualTrigger?: React.RefObject<HTMLElement | null>;
};

export const FloatingTrigger = React.forwardRef<
  HTMLElement,
  FloatingTriggerProps
>(({ virtualTrigger, ...props }, forwardedRef) => {
  const ctx = useFloatingContext();
  const ref = React.useRef<HTMLElement | null>(null);
  const composedRefs = useMergeRefs(ref, forwardedRef);

  React.useLayoutEffect(() => {
    ctx.setAnchor(virtualTrigger?.current || ref.current);
  }, [ref, virtualTrigger, ctx]);

  return <Slot {...props} ref={composedRefs as any} />;
});

FloatingTrigger.displayName = "FloatingTrigger";
