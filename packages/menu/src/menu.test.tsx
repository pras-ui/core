import { render, screen, fireEvent } from "@testing-library/react";
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  useMenuContext,
} from "./index";
import { describe, it, expect, vi } from "vitest";
import React from "react";

const TriggerWithClickHandler = () => {
  const { setOpen } = useMenuContext();
  return (
    <MenuTrigger asChild>
      <button onClick={() => setOpen(true)}>Trigger</button>
    </MenuTrigger>
  );
};

const TestMenu = ({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) => {
  return (
    <MenuRoot onOpenChange={onOpenChange}>
      <TriggerWithClickHandler />
      <MenuContent>
        <MenuItem>Item 1</MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};

describe("@pras-ui/menu", () => {
  it("should open and close the menu", async () => {
    const onOpenChange = vi.fn();
    render(<TestMenu onOpenChange={onOpenChange} />);

    const trigger = screen.getByText("Trigger");

    // Open the menu
    fireEvent.click(trigger);
    await screen.findByText("Item 1");
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Close the menu by clicking the item
    fireEvent.click(screen.getByText("Item 1"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("should not close on item click if closeOnSelect is false", async () => {
    render(
      <MenuRoot>
        <TriggerWithClickHandler />
        <MenuContent>
          <MenuItem closeOnSelect={false}>Item 1</MenuItem>
        </MenuContent>
      </MenuRoot>
    );

    const trigger = screen.getByText("Trigger");
    fireEvent.click(trigger);
    await screen.findByText("Item 1");

    fireEvent.click(screen.getByText("Item 1"));
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });
});
