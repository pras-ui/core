import * as React from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow as floatingArrow,
  hide,
  type Side,
  type Boundary,
  limitShift,
  size,
  type Middleware,
  type Placement,
} from "@floating-ui/react-dom";
import { useId, createContextScope } from "@pras-ui/crux";
import { useMergeRefs } from "@pras-ui/crux";
import type { Align } from "./types";
import { Portal } from "@pras-ui/shared-ui";
import { RemoveScroll } from "react-remove-scroll";
import { createSlot, Element, Slot } from "@pras-ui/slot";

const ScrollLocker = createSlot("ScrollLockComponent");

/* ------------------------------------------------------------------------------------
 * FloatingKit Context
 * ----------------------------------------------------------------------------------*/

type FloatingContextType = {
  anchor: HTMLElement | null;
  setAnchor: (anchor: HTMLElement | null) => void;
  alwaysRender: boolean;
  setAlwaysRender: (state: boolean) => void;
};

export const [FloatingProvider, useFloatingContext, createFloatingScope] =
  createContextScope<FloatingContextType>("FloatingKit");
/* ------------------------------------------------------------------------------------
 * FloatingRoot
 * ----------------------------------------------------------------------------------*/
interface FloatingRootProps {
  children: React.ReactNode;
}

export const FloatingRoot = ({ children }: FloatingRootProps) => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [alwaysRender, setAlwaysRender] = React.useState<boolean>(false);

  return (
    <FloatingProvider
      scopeId={useId()}
      value={{ anchor, setAnchor, alwaysRender, setAlwaysRender }}
    >
      {children}
    </FloatingProvider>
  );
};

FloatingRoot.displayName = "FloatingRoot";

/* ------------------------------------------------------------------------------------
 * FloatingAnchor
 * ----------------------------------------------------------------------------------*/
type FloatingAnchorProps = React.ComponentProps<typeof Element.div> & {
  children?: React.ReactNode;
  virtualAnchor?: React.RefObject<HTMLElement>;
};

export const FloatingAnchor = React.forwardRef<
  HTMLElement,
  FloatingAnchorProps
>(({ virtualAnchor, ...props }, forwardedRef) => {
  const ctx = useFloatingContext();
  const ref = React.useRef<HTMLElement>(null);
  const composedRefs = useMergeRefs(ref, forwardedRef);

  React.useLayoutEffect(() => {
    ctx.setAnchor(virtualAnchor?.current || ref.current);
  }, [ref, ctx]);

  return <Slot {...props} ref={composedRefs as any} />;
});

FloatingAnchor.displayName = "FloatingAnchor";

type FloatingContentProviderValues = {
  side: Side;
  registerArrow: (arrow: HTMLElement) => void;
  unregisterArrow: (arrow?: null) => void;
  arrow: HTMLElement | null;
  arrowXAxis?: number;
  arrowYAxis?: number;
};

export const [
  FloatingContentProvider,
  useFloatingContentContext,
  createFloatingContentScope,
] = createContextScope<FloatingContentProviderValues>("FloatingContent");

/* ------------------------------------------------------------------------------------
 * FloatingContent
 * ----------------------------------------------------------------------------------*/
interface FloatingContentProps
  extends React.ComponentProps<typeof Element.div> {
  /**
   * The side of the floating element
   */
  side?: Side;
  /**
   * The alignment of the floating element
   */
  align?: Align;
  /**
   * The offset of the floating element from the anchor
   */
  sideOffset?: number;
  /**
   * Whether the user has interacted with trigger element
   *
   * @internal_use_only
   */
  isPresent?: boolean;
  /**
   * The padding of the arrow
   */
  arrowPadding?: number;
  /**
   * Whether to avoid collisions
   * @default true
   */
  avoidCollisions?: boolean;
  /**
   * The boundary of the floating element
   */
  collisionBoundary?: Boundary | Boundary[];
  /**
   * The padding of the floating element
   * @default 0
   */
  collisionPadding?: number | Partial<Record<Side, number>>;
  /**
   * Whether to sticky the floating element
   * @default "partial"
   */
  sticky?: "partial" | "always";
  /**
   * Whether to auto hide the floating element on detach
   * @default false
   */
  autoHideOnDetach?: boolean;
  /**
   * Whether to remove scroll on the floating element
   * @default true
   */
  removeScroll?: boolean;
  /**
   * The position of the floating element
   * @default "fixed"
   */
  position?: "absolute" | "fixed";
  /**
   * The frequency of the floating element position update
   * @default "lazy"
   */
  updatePositionFrequency?: "lazy" | "rapid";
  /**
   *
   */
  alwaysRender?: boolean;
}

export const FloatingContent = React.forwardRef<
  HTMLDivElement,
  FloatingContentProps
>(
  (
    {
      side = "bottom",
      sideOffset = 0,
      position = "fixed",
      align = "center",
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding = 0,
      sticky = "partial",
      updatePositionFrequency = "lazy",
      autoHideOnDetach = false,
      removeScroll = true,
      children,
      isPresent,
      alwaysRender,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const ctx = useFloatingContext();

    const [arrowElement, setArrowElement] = React.useState<HTMLElement | null>(
      null
    );

    const arrowW = arrowElement?.offsetWidth ?? 0;
    const arrowH = arrowElement?.offsetHeight ?? 0;

    const padding = normalizePadding(collisionPadding);

    const boundary = Array.isArray(collisionBoundary)
      ? collisionBoundary
      : [collisionBoundary];

    const detectOverflowOptions = {
      padding: padding,
      boundary: boundary.filter((val) => val !== null),
    };

    const { placement, floatingStyles, isPositioned, middlewareData, refs } =
      useFloating({
        strategy: position,
        placement: (side +
          (align !== "center" ? "-" + align : "")) as Placement,
        whileElementsMounted: (...args) => {
          const cleanup = autoUpdate(...args, {
            animationFrame: updatePositionFrequency === "rapid",
          });
          return cleanup;
        },
        elements: {
          reference: ctx.anchor,
        },
        middleware: [
          offset({ mainAxis: sideOffset + arrowH }),
          size({
            ...(detectOverflowOptions as any),
            apply: ({ elements, rects, availableWidth, availableHeight }) => {
              const { width: anchorWidth, height: anchorHeight } =
                rects.reference;
              const style = elements.floating.style;
              style.setProperty(
                "--pras-floating-kit-available-width",
                `${availableWidth}px`
              );
              style.setProperty(
                "--pras-floating-kit-available-height",
                `${availableHeight}px`
              );
              style.setProperty(
                "--pras-floating-kit-anchor-width",
                `${anchorWidth}px`
              );
              style.setProperty(
                "--pras-floating-kit-anchor-height",
                `${anchorHeight}px`
              );
            },
          }),
          avoidCollisions &&
            (shift({
              mainAxis: true,
              crossAxis: true,
              limiter: sticky === "partial" ? limitShift() : undefined,
              ...(detectOverflowOptions as any),
            }),
            flip({ ...(detectOverflowOptions as any) })),
          arrowElement &&
            floatingArrow({
              element: arrowElement,
            }),
          transformOrigin({ arrowWidth: arrowW, arrowHeight: arrowH }),
          autoHideOnDetach &&
            hide({
              strategy: "referenceHidden",
              ...(detectOverflowOptions as any),
            }),
        ],
      });

    const [resolvedSide, resolvedAlign] = placement.split("-");

    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;

    const mergedRefs = useMergeRefs(forwardedRef, refs.setFloating);

    const ScrollLock = removeScroll
      ? {
          Element: RemoveScroll,
          props: {
            as: ScrollLocker,
          },
        }
      : { Element: React.Fragment };

      return (
      <FloatingContentProvider
        scopeId={useId()}
        value={{
          registerArrow: (arrow: HTMLElement) => setArrowElement(arrow),
          unregisterArrow: () => setArrowElement(null),
          arrow: arrowElement,
          arrowXAxis: arrowX,
          arrowYAxis: arrowY,
          side: resolvedSide as Side,
        }}
      >
        <ScrollLock.Element {...ScrollLock?.props}>
          <Element.div
            ref={mergedRefs as any}
            style={{
              ...floatingStyles,
              transform: isPositioned
                ? floatingStyles.transform
                : "translate(0, -200%)",
              zIndex: 9999,
              pointerEvents:
                isPresent || alwaysRender || ctx.alwaysRender ? "auto" : "none",

              ...(!isEveryValueZero(ctx.anchor?.getBoundingClientRect()) &&
                middlewareData.hide?.referenceHidden && {
                  visibility: "hidden",
                  pointerEvents: "none",
                }),

              ...style,
            }}
            childProps={{
              "data-side": resolvedSide,
              "data-align": resolvedAlign || align,
            }}
            {...props}
          >
            {children}
          </Element.div>
        </ScrollLock.Element>
      </FloatingContentProvider>
    );
  }
);

FloatingContent.displayName = "FloatingContent";

function isEveryValueZero(obj: Record<string, any> | undefined) {
  return obj && Object.values(obj).every((value) => value === 0);
}

const transformOrigin = (options: {
  arrowWidth: number;
  arrowHeight: number;
}): Middleware => ({
  name: "transformOrigin",
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data;

    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const isArrow = !cannotCenterArrow;
    const arrowWidth = isArrow ? 0 : options.arrowWidth;
    const arrowHeight = isArrow ? 0 : options.arrowHeight;

    const [resolvedSide, resolvedAlign] = placement.split("-") as [Side, Align];
    const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[
      resolvedAlign
    ];

    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;

    let x = "",
      y = "";

    if (resolvedSide === "bottom") {
      x = isArrow ? noArrowAlign : `${arrowXCenter}px`;
      y = `${-arrowHeight}px`;
    } else if (resolvedSide === "top") {
      x = isArrow ? noArrowAlign : `${arrowXCenter}px`;
      y = `${rects.floating.height + arrowHeight}px`;
    } else if (resolvedSide === "right") {
      x = `${-arrowHeight}px`;
      y = isArrow ? noArrowAlign : `${arrowYCenter}px`;
    } else if (resolvedSide === "left") {
      x = `${rects.floating.width + arrowHeight}px`;
      y = isArrow ? noArrowAlign : `${arrowYCenter}px`;
    }

    return { data: { x, y } };
  },
});

export const FloatingArrow = React.forwardRef<
  HTMLElement,
  React.SVGProps<SVGSVGElement>
>(({ style, children, ...props }, forwardedRef) => {
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
        <svg viewBox="0 0 10 5" fill="currentColor" {...props}>
          <path d="m0 0l5 5 5-5z" />
        </svg>
      )}
    </span>
  );
});

FloatingArrow.displayName = "FloatingArrow";

function normalizePadding(
  padding: number | Partial<Record<Side, number>>
): Record<Side, number> {
  if (typeof padding === "number") {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
  }
  return {
    top: padding.top ?? 0,
    right: padding.right ?? 0,
    bottom: padding.bottom ?? 0,
    left: padding.left ?? 0,
  };
}

export function shouldMount({
  isPresent,
  alwaysRender,
  globalAlwaysRender,
}: {
  isPresent: boolean;
  alwaysRender?: boolean;
  globalAlwaysRender?: boolean;
}) {
  return alwaysRender || globalAlwaysRender || isPresent;
}

export interface FloatingPortalProps
  extends React.ComponentProps<typeof Portal> {
  alwaysRender?: boolean;
}

export const FloatingPortal = ({
  children,
  alwaysRender,
  ...props
}: FloatingPortalProps) => {
  const { setAlwaysRender } = useFloatingContext();

  React.useEffect(() => {
    if (alwaysRender !== undefined) {
      setAlwaysRender(alwaysRender);
    }
  }, [alwaysRender, setAlwaysRender]);

  return <Portal {...props}>{children}</Portal>;
};

FloatingPortal.displayName = "FloatingPortal";
