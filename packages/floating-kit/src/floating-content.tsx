import * as React from "react";
import {
  useFloating,
  type Boundary,
  type Placement,
  flip,
  shift,
  limitShift,
  size,
  offset,
  arrow as floatingArrow,
  autoUpdate,
  hide,
} from "@floating-ui/react-dom";
import { useId, createContextScope } from "@pras-ui/core";
import { useMergeRefs } from "@pras-ui/core";
import { RemoveScroll } from "react-remove-scroll";
import { createSlot, Element } from "@pras-ui/slot";
import { useFloatingContext } from "./floating-root";

const ScrollLocker = createSlot("ScrollLockComponent");

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

export type Side = "top" | "bottom" | "left" | "right";
export type Align = "center" | "start" | "end";

/* ------------------------------------------------------------------------------------
 * FloatingContent
 * ----------------------------------------------------------------------------------*/
type FloatingContentProps = React.ComponentProps<typeof Element.div> & {
  /**
   * @default "ltr"
   * @internal_use_only
   */
  dir?: "ltr" | "rtl";
  /**
   * The side of the floating element
   */
  side?: Side | "auto";
  /**
   * The alignment of the floating element
   */
  align?: Align;
  /**
   * The side offset of the floating element from the anchor
   */
  sideOffset?: number;
  /**
   * The alignment offset of the floating element from the anchor
   */
  alignOffset?: number;
  /**
   * Whether the user has interacted with trigger element
   *
   * @internal_use_only
   */
  isPresent?: boolean;
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
   * @virtual_trigger_mode_not_supported
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
   * Whether to always render the floating element
   *
   * @default false
   */
  alwaysRender?: boolean;
};

export const FloatingContent = React.forwardRef<
  HTMLDivElement,
  FloatingContentProps
>(
  (
    {
      side = "bottom",
      sideOffset = 0,
      alignOffset = 0,
      position = "fixed",
      align = "center",
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
      dir = "ltr",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const ctx = useFloatingContext();

    const RESOLVED_SIDE =
      side === "auto" ? (dir === "rtl" ? "left" : "right") : side;

    const [arrowElement, setArrowElement] = React.useState<HTMLElement | null>(
      null
    );

    const arrowW = arrowElement?.offsetWidth ?? 0;
    const arrowH = arrowElement?.offsetHeight ?? 0;

    const boundary = Array.isArray(collisionBoundary)
      ? collisionBoundary
      : [collisionBoundary];

    const padding = normalizePadding(collisionPadding);

    const overflow = {
      padding: padding,
      boundary: boundary.filter((val) => val !== null),
    };

    const { placement, floatingStyles, isPositioned, middlewareData, refs } =
      useFloating({
        strategy: position,
        placement: (RESOLVED_SIDE +
          (align !== "center" ? "-" + align : "")) as Placement,
        whileElementsMounted: (...args) => {
          return autoUpdate(...args, {
            animationFrame: updatePositionFrequency === "rapid",
            ancestorResize: true,
            ancestorScroll: true,
          });
        },
        elements: {
          reference: ctx.anchor,
        },
        middleware: [
          offset({ alignmentAxis: alignOffset, mainAxis: sideOffset + arrowH }),
          size({
            ...(overflow as any),
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
              ...(overflow as any),
            }),
            flip({ ...(overflow as any) })),
          arrowElement && floatingArrow({ element: arrowElement }),
          {
            name: "transformOrigin",
            fn(data: any) {
              const { x, y } = computeTransformOrigin(
                data.placement,
                data.rects,
                data.middlewareData,
                arrowW,
                arrowH
              );

              return { data: { x, y } };
            },
          },
          autoHideOnDetach &&
            hide({
              strategy: "referenceHidden",
              ...(overflow as any),
            }),
        ].filter(Boolean),
      });

    const [resolvedSide, resolvedAlign] = placement.split("-");

    const mergedRefs = useMergeRefs(forwardedRef, refs.setFloating);

    const ScrollLock = removeScroll
      ? {
          Element: RemoveScroll,
          props: {
            as: ScrollLocker,
          },
        }
      : { Element: React.Fragment };

    const dataAttributes = {
      "data-side": resolvedSide,
      "data-align": resolvedAlign || align,
    };

    return (
      <FloatingContentProvider
        scopeId={useId()}
        value={{
          registerArrow: (arrow: HTMLElement) => setArrowElement(arrow),
          unregisterArrow: () => setArrowElement(null),
          arrow: arrowElement,
          arrowXAxis: middlewareData.arrow?.x,
          arrowYAxis: middlewareData.arrow?.y,
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

              ["--pras-floating-kit-transform-origin" as string]: `${middlewareData.transformOrigin?.x} ${middlewareData.transformOrigin?.y}`,

              ...style,
            }}
            childProps={{
              ...dataAttributes,
            }}
            {...dataAttributes}
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

/**
 * @internal_use_only
 */
function isEveryValueZero(obj: Record<string, any> | undefined): boolean {
  if (!obj) return false;
  return Object.values(obj).every(
    (value) => typeof value === "number" && Math.abs(value) < 0.01
  );
}

/**
 * @internal_use_only
 */
function computeTransformOrigin(
  placement: string,
  rects: any,
  middlewareData: any,
  arrowW: number,
  arrowH: number
) {
  const [side, align] = placement.split("-") as [Side, Align];
  const alignMap = { start: "0%", center: "50%", end: "100%" };
  const arrowX = (middlewareData.arrow?.x ?? 0) + arrowW / 2;
  const arrowY = (middlewareData.arrow?.y ?? 0) + arrowH / 2;

  if (side === "top" || side === "bottom") {
    return {
      x:
        middlewareData.arrow?.centerOffset !== 0
          ? alignMap[align]
          : `${arrowX}px`,
      y:
        side === "bottom"
          ? `${-arrowH}px`
          : `${rects.floating.height + arrowH}px`,
    };
  }

  return {
    x: side === "right" ? `${-arrowH}px` : `${rects.floating.width + arrowH}px`,
    y:
      middlewareData.arrow?.centerOffset !== 0
        ? alignMap[align]
        : `${arrowY}px`,
  };
}

/**
 * @internal_use_only
 */
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
