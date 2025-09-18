import * as React from "react";

type RefType<T> = React.Ref<T> | undefined;

const updateRef = <T>(ref: RefType<T>, value: T): (() => void) | undefined => {
  if (typeof ref === "function") {
    ref(value);
    return () => ref(null as any);
  } else if (ref !== null && ref !== undefined) {
    const currentRef = ref as React.RefObject<T>;
    currentRef.current = value;
    return () => {
      currentRef.current = null as any;
    };
  }
};

/**
 * A hook that merges multiple refs into a single ref callback.
 * Useful when you need to assign multiple refs to the same element.
 *
 * @example
 * const ref1 = React.useRef(null)
 * const ref2 = React.useRef(null)
 * const mergedRef = useMergeRefs(ref1, ref2)
 *
 * return <div ref={mergedRef} />
 */
const useMergeRefs = <T>(...refs: RefType<T>[]): React.RefCallback<T> => {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = updateRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });

    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            updateRef(refs[i], null);
          }
        }
      };
    }
  };
};

export { useMergeRefs };
