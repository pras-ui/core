import * as React from "react";
import {
  Slot as RadixSlot,
  Slottable as RadixSlottable,
  createSlot as RadixCreateSlot,
  createSlottable as RadixCreateSlottable,
} from "@radix-ui/react-slot";
import { useMergeRefs } from "@pras-ui/crux";

type AnyTag = React.ElementType;

type CreateTagProps<E extends AnyTag> = React.ComponentPropsWithRef<E> & {
  /**
   * When `true`, the component's all props will be passed to the child element.
   */
  asChild?: boolean;

  /**
   * Replaces the underlying element type.
   */
  as?: AnyTag;

  /**
   * Specific props to be merged into the child element when not using `asChild`.
   */
  childProps?: Partial<React.ComponentProps<E>> & Record<string, any>;
};

/**
 * Creates a customizable component that supports `asChild`, `as`, and `childProps` behaviors.
 *
 * @param defaultTag - The default element or component to render.
 * @returns A forward-ref component that dynamically renders based on props.
 */
function createTag<E extends AnyTag>(defaultTag: E) {
  const Tag = React.forwardRef<HTMLElement, CreateTagProps<E>>(
    ({ asChild, as, childProps, children, ...props }, ref) => {
      const Component = asChild ? Slot : as || defaultTag;

      if (asChild && childProps && process.env.NODE_ENV !== "production") {
        console.warn(
          "You cannot use both 'asChild' and 'childProps'. 'childProps' will be ignored."
        );
      }

      if (!asChild && childProps && React.isValidElement(children)) {
        return (
          <Component {...props} ref={ref}>
            {React.cloneElement(children, {
              ...childProps,
              ref: useMergeRefs(ref, (children as any).props.ref),
            })}
          </Component>
        );
      }

      return (
        <Component {...props} ref={ref}>
          {children}
        </Component>
      );
    }
  );

  Tag.displayName = `Tag(${
    typeof defaultTag === "string"
      ? defaultTag
      : defaultTag.displayName || defaultTag.name || "Component"
  })`;

  return Tag;
}

/**
 * A wrapper component that forwards all props to its single child.
 * Useful for customizing the rendered element while preserving props and refs.
 *
 *
 */
const Slot: typeof RadixSlot = RadixSlot;

/**
 * Marks a child component as slottable, allowing it to receive props from a parent Slot.
 *
 * Use case: when multiple same-level children exist inside a Slot,
 * Slottable helps define which child will receive the props from the Slot.
 */
const Slottable: typeof RadixSlottable = RadixSlottable;

/**
 * Creates a custom Slot component.
 * Useful when you need to create multiple Slot components with different behaviors or identifiers.
 */
const createSlot: typeof RadixCreateSlot = RadixCreateSlot;

/**
 * Creates a custom Slottable component.
 * Useful when you want to mark a component as slottable for a specific Slot.
 */
const createSlottable: typeof RadixCreateSlottable = RadixCreateSlottable;

export { Slot, Slottable, createSlot, createSlottable, createTag };
