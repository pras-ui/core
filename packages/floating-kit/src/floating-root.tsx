import * as React from "react";
import { useId, createContextScope } from "@pras-ui/core";

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
