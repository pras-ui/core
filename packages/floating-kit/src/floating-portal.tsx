import * as React from "react";
import { Portal } from "@pras-ui/shared-ui";
import { useFloatingContext } from "./floating-root";

export type FloatingPortalProps = React.ComponentProps<typeof Portal> & {
  alwaysRender?: boolean;
};

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
