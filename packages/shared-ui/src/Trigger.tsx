import React from "react";
import { Element } from "@pras-ui/slot";

/**
 * @component Trigger
 *
 * Base Trigger component of `pras-ui`
 */
export const Trigger = React.forwardRef<
  HTMLElement,
  React.ComponentProps<typeof Element.button>
>(({ style, children, ...props }, ref) => {
  return (
    <Element.button
      {...props}
      style={{ pointerEvents: "auto", ...style }}
      ref={ref}
    >
      {children}
    </Element.button>
  );
});

Trigger.displayName = "Trigger";
