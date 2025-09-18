import { createContextScope } from "@pras-ui/core";
import { Element } from "@pras-ui/slot";
import * as React from "react";
import { useId } from "@pras-ui/core";

/* ------------------------------------------------------------------------------------
 * Group Context
 * ----------------------------------------------------------------------------------*/
type GroupContextType = {
  groupId: string;
  labelId: string;
};

export const [GroupProvider, useGroupContext, createGroupScope] =
  createContextScope<GroupContextType>("MenuGroup");

/* ------------------------------------------------------------------------------------
 * Menu Group
 * ----------------------------------------------------------------------------------*/
interface MenuGroupProps extends React.ComponentProps<typeof Element.div> {}

export const MenuGroup = React.forwardRef<
  React.ComponentRef<typeof Element.div>,
  MenuGroupProps
>(({ ...props }, forwardRef) => {
  const groupId = useId("group");
  const labelId = useId("label");

  return (
    <GroupProvider scopeId={useId()} value={{ groupId, labelId }}>
      <Element.div
        role="group"
        id={groupId}
        aria-labelledby={labelId}
        ref={forwardRef}
        {...props}
      />
    </GroupProvider>
  );
});

MenuGroup.displayName = "MenuGroup";
