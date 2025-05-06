import * as React from "react";
import { useStateFlow } from "./useStateFlow";

function usePresence(present: boolean) {
  const [state, send] = useStateFlow(present ? "mounted" : "unmounted", {
    mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
    unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
    unmounted: { MOUNT: "mounted" },
  });

  const stylesRef = React.useRef<CSSStyleDeclaration>({} as any);
  const [node, setNode] = React.useState<HTMLElement>();
  const prevAnimationRef = React.useRef<string>("none");
  const prevPresentRef = React.useRef(present);

  React.useLayoutEffect(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const changed = wasPresent !== present;

    if (changed) {
      const currentName = styles?.animationName || "none";
      const prevName = prevAnimationRef.current;

      if (present) {
        send("MOUNT");
      } else if (currentName === "none" || styles?.display === "none") {
        send("UNMOUNT");
      } else if (wasPresent && prevName !== currentName) {
        send("ANIMATION_OUT");
      } else {
        send("UNMOUNT");
      }

      prevPresentRef.current = present;
    }
  }, [present, send]);

  React.useLayoutEffect(() => {
    if (!node) {
      send("ANIMATION_END");
      return;
    }

    let timeoutId: number;
    const win = node.ownerDocument.defaultView ?? window;

    const handleEnd = (event: AnimationEvent) => {
      if (event.target === node) {
        const current = stylesRef.current?.animationName || "none";
        if (current.includes(event.animationName)) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            node.style.animationFillMode = "forwards";
            timeoutId = win.setTimeout(() => {
              node.style.animationFillMode = "";
            });
          }
        }
      }
    };

    const handleStart = (event: AnimationEvent) => {
      if (event.target === node) {
        prevAnimationRef.current = stylesRef.current?.animationName || "none";
      }
    };

    node.addEventListener("animationstart", handleStart);
    node.addEventListener("animationend", handleEnd);
    node.addEventListener("animationcancel", handleEnd);

    return () => {
      win.clearTimeout(timeoutId);
      node.removeEventListener("animationstart", handleStart);
      node.removeEventListener("animationend", handleEnd);
      node.removeEventListener("animationcancel", handleEnd);
    };
  }, [node]);

  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: (el: HTMLElement | null) => {
      if (el) stylesRef.current = getComputedStyle(el);
      setNode(el || undefined);
    },
  };
}

export { usePresence };
