import { FloatingRoot } from "@pras-ui/floating-kit";
import { SubMenuRoot } from "@pras-ui/menu";

/* ------------------------------------------------------------------------------------
 * PopupSubMenu Root
 * ----------------------------------------------------------------------------------*/
export const PopupSubMenuRoot: React.FC<
  React.ComponentProps<typeof SubMenuRoot>
> = ({ children, ...props }) => {
  return (
    <SubMenuRoot {...props}>
      <FloatingRoot>{children}</FloatingRoot>
    </SubMenuRoot>
  );
};
