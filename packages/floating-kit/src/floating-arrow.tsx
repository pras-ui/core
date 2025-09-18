import * as React from "react";
import { useMergeRefs } from "@pras-ui/core";
import { useFloatingContentContext } from "./floating-content";

export const FloatingArrow = React.forwardRef<
  HTMLElement,
  React.SVGProps<SVGSVGElement>
>(({ style, children, fill, width, height, ...props }, forwardedRef) => {
  const { registerArrow, unregisterArrow, arrowXAxis, arrowYAxis, side } =
    useFloatingContentContext();

  const arrowRef = React.useRef<SVGSVGElement>(null);
  const mergedRef = useMergeRefs(forwardedRef, arrowRef as any);

  React.useEffect(() => {
    if (arrowRef.current) {
      registerArrow(arrowRef.current as any);
      return () => unregisterArrow(null);
    }
  }, [registerArrow, unregisterArrow]);

  return (
    <span
      ref={mergedRef}
      style={{
        position: "absolute",
        left: arrowXAxis,
        top: arrowYAxis,
        [{
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
        }[side]]: 0,
        transformOrigin: {
          top: undefined,
          right: "0 0",
          bottom: "center 0",
          left: "100% 0",
        }[side],
        transform: {
          top: "translateY(100%)",
          right: "translateY(50%) rotate(90deg) translateX(-50%)",
          bottom: "rotate(180deg)",
          left: "translateY(50%) rotate(-90deg) translateX(50%)",
        }[side],
      }}
    >
      {children || (
        <svg
          viewBox="0 0 10 5"
          width={width || 20}
          height={height || 10}
          fill={fill || "currentColor"}
          {...props}
        >
          <path d="m0 0l5 5 5-5z" />
        </svg>
      )}
    </span>
  );
});

FloatingArrow.displayName = "FloatingArrow";
