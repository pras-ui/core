import React, { useState } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  /**
   * The children to be rendered.
   */
  children?: React.ReactNode;
  /**
   * The element to render the children into. 
   * @default document.body
   */
  to?: Element | DocumentFragment | null;
}

/**
 * Renders children into anywhere in the DOM
 *
 * Accepts an optional `to` prop which can be an Element, DocumentFragment, or
 * a function that returns an Element or DocumentFragment. If `to` is not
 * provided, the portal will render to `document.body`.
 *
 * This component is useful when you need to render a component outside of its
 * parent component, such as when you need to render a modal or a tooltip.
 *
 * Note that this component requires a DOM and will not work in environments
 * where a DOM is not available.
 *
 * @example
 * import { Portal } from "@pras-ui/crux";
 *
 * function Modal() {
 *   return (
 *     <Portal>
 *       <div>
 *         This is a modal
 *       </div>
 *     </Portal>
 *   );
 * }
 */
export const Portal: React.FC<PortalProps> = ({ children, to }) => {
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState<Element | DocumentFragment | null>(null);

  React.useLayoutEffect(() => {
    setMounted(true);
    if (to instanceof Element || to instanceof DocumentFragment) {
      setTarget(to);
    } else if (typeof document !== "undefined") {
      setTarget(document.body);
    }

    return () => {
      setMounted(false);
    };
  }, [to]);

  if (!mounted || !target) return null;

  return createPortal(children, target);
};
