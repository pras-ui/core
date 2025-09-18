import React from "react";

/**
 * Compose multiple event handlers into a single one.
 *
 * @param {...function} handlers - A list of event handlers to compose. Each handler will be called with the event object until one calls `event.preventDefault()` or `event.stopPropagation()`.
 * @returns {function} A single event handler that will call all the handlers in sequence.
 */
export function composeEventHandlers<E extends React.SyntheticEvent>(
  ...handlers: Array<((event: E) => void) | undefined>
): (event: E) => void {
  return (event: E) => {
    for (const handler of handlers) {
      handler?.(event);
      if (event.defaultPrevented) {
        break;
      }
    }
  };
}
