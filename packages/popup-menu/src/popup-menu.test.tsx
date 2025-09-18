import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  PopupMenuRoot,
  PopupMenuTrigger,
  PopupMenuContent,
  PopupMenuItem,
  PopupMenuPortal,
  PopupSubMenuRoot,
  PopupSubMenuTrigger,
  PopupSubMenuContent,
  PopupMenuChoice,
  PopupMenuChoiceItem,
  PopupMenuChoiceIndicator,
} from "./index";

describe("PopupMenu", () => {
  it("should render trigger", () => {
    render(
      <PopupMenuRoot>
        <PopupMenuTrigger asChild>
          <button>Trigger</button>
        </PopupMenuTrigger>
        <PopupMenuContent>
          <PopupMenuItem>Item 1</PopupMenuItem>
        </PopupMenuContent>
      </PopupMenuRoot>
    );

    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("should open on click and close on item click", async () => {
    const onOpenChange = vi.fn();
    render(
      <PopupMenuRoot onOpenChange={onOpenChange}>
        <PopupMenuTrigger asChild>
          <button>Trigger</button>
        </PopupMenuTrigger>
        <PopupMenuPortal>
          <PopupMenuContent>
            <PopupMenuItem>Item 1</PopupMenuItem>
          </PopupMenuContent>
        </PopupMenuPortal>
      </PopupMenuRoot>
    );

    const trigger = screen.getByText("Trigger");
    
    // The menu is not rendered initially because of usePresence
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

    // Open the menu
    fireEvent.click(trigger);
    await screen.findByText("Item 1");
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Close the menu by clicking the item
    fireEvent.click(screen.getByText("Item 1"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("should open on right-click in context menu mode", async () => {
    render(
      <PopupMenuRoot mode="context">
        <PopupMenuTrigger asChild>
          <button>Trigger</button>
        </PopupMenuTrigger>
        <PopupMenuPortal>
          <PopupMenuContent>
            <PopupMenuItem>Item 1</PopupMenuItem>
          </PopupMenuContent>
        </PopupMenuPortal>
      </PopupMenuRoot>
    );

    const trigger = screen.getByText("Trigger");
    
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

    // Open the menu with right-click
    fireEvent.contextMenu(trigger);
    await screen.findByText("Item 1");
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("should open a submenu", async () => {
    render(
      <PopupMenuRoot>
        <PopupMenuTrigger asChild>
          <button>Trigger</button>
        </PopupMenuTrigger>
        <PopupMenuPortal>
          <PopupMenuContent>
            <PopupMenuItem>Item 1</PopupMenuItem>
            <PopupSubMenuRoot>
              <PopupSubMenuTrigger>Submenu Trigger</PopupSubMenuTrigger>
              <PopupMenuPortal>
                <PopupSubMenuContent>
                  <PopupMenuItem>Sub Item 1</PopupMenuItem>
                </PopupSubMenuContent>
              </PopupMenuPortal>
            </PopupSubMenuRoot>
          </PopupMenuContent>
        </PopupMenuPortal>
      </PopupMenuRoot>
    );

    // Open the main menu
    fireEvent.click(screen.getByText("Trigger"));
    await screen.findByText("Item 1");

    // Hover over the submenu trigger
    fireEvent.mouseEnter(screen.getByText("Submenu Trigger"));

    // Check if the submenu item is visible
    await screen.findByText("Sub Item 1");
    expect(screen.getByText("Sub Item 1")).toBeInTheDocument();
  });

  it("should handle single choice selection", async () => {
    const onValueChange = vi.fn();
    render(
      <PopupMenuRoot>
        <PopupMenuTrigger asChild>
          <button>Trigger</button>
        </PopupMenuTrigger>
        <PopupMenuPortal>
          <PopupMenuContent>
            <PopupMenuChoice mode="single" defaultValue="item2" onChange={onValueChange}>
              <PopupMenuChoiceItem value="item1">
                Item 1 <PopupMenuChoiceIndicator />
              </PopupMenuChoiceItem>
              <PopupMenuChoiceItem value="item2">
                Item 2 <PopupMenuChoiceIndicator />
              </PopupMenuChoiceItem>
            </PopupMenuChoice>
          </PopupMenuContent>
        </PopupMenuPortal>
      </PopupMenuRoot>
    );

    // Open the menu
    fireEvent.click(screen.getByText("Trigger"));
    await screen.findByText("Item 1");

    // Check initial selection
    const item2 = screen.getByText("Item 2");
    expect(item2.getAttribute("data-state")).toBe("selected");

    // Change selection
    const item1 = screen.getByText("Item 1");
    fireEvent.click(item1);
    expect(onValueChange).toHaveBeenCalledWith("item1");
  });

  it("should handle multiple choice selection", async () => {
    const onValueChange = vi.fn();
    render(
      <PopupMenuRoot>
        <PopupMenuTrigger asChild>
          <button>Trigger</button>
        </PopupMenuTrigger>
        <PopupMenuPortal>
          <PopupMenuContent>
            <PopupMenuChoice mode="multiple" defaultValue={["item1"]} onChange={onValueChange}>
              <PopupMenuChoiceItem value="item1">
                Item 1 <PopupMenuChoiceIndicator />
              </PopupMenuChoiceItem>
              <PopupMenuChoiceItem value="item2">
                Item 2 <PopupMenuChoiceIndicator />
              </PopupMenuChoiceItem>
            </PopupMenuChoice>
          </PopupMenuContent>
        </PopupMenuPortal>
      </PopupMenuRoot>
    );

    // Open the menu
    fireEvent.click(screen.getByText("Trigger"));
    await screen.findByText("Item 1");

    // Check initial selection
    const item1 = screen.getByText("Item 1");
    expect(item1.getAttribute("data-state")).toBe("selected");

    // Add to selection
    const item2 = screen.getByText("Item 2");
    fireEvent.click(item2);
    expect(onValueChange).toHaveBeenCalledWith(["item1", "item2"]);
  });

  it("should open a submenu with a delay", async () => {
    render(
      <PopupMenuRoot>
        <PopupMenuTrigger asChild>
          <button>Trigger</button>
        </PopupMenuTrigger>
        <PopupMenuPortal>
          <PopupMenuContent>
            <PopupSubMenuRoot delay={200}>
              <PopupSubMenuTrigger>Submenu Trigger</PopupSubMenuTrigger>
              <PopupMenuPortal>
                <PopupSubMenuContent>
                  <PopupMenuItem>Sub Item 1</PopupMenuItem>
                </PopupSubMenuContent>
              </PopupMenuPortal>
            </PopupSubMenuRoot>
          </PopupMenuContent>
        </PopupMenuPortal>
      </PopupMenuRoot>
    );

    // Open the main menu
    fireEvent.click(screen.getByText("Trigger"));
    await screen.findByText("Submenu Trigger");

    vi.useFakeTimers();

    // Hover over the submenu trigger
    fireEvent.mouseEnter(screen.getByText("Submenu Trigger"));

    // Check that it's not open immediately
    expect(screen.queryByText("Sub Item 1")).not.toBeInTheDocument();

    // Advance timers
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Flush promises
    await act(async () => {});

    expect(screen.getByText("Sub Item 1")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("should not open a submenu if mouse leaves before delay", async () => {
    render(
      <PopupMenuRoot>
        <PopupMenuTrigger asChild>
          <button>Trigger</button>
        </PopupMenuTrigger>
        <PopupMenuPortal>
          <PopupMenuContent>
            <PopupSubMenuRoot delay={200}>
              <PopupSubMenuTrigger>Submenu Trigger</PopupSubMenuTrigger>
              <PopupMenuPortal>
                <PopupSubMenuContent>
                  <PopupMenuItem>Sub Item 1</PopupMenuItem>
                </PopupSubMenuContent>
              </PopupMenuPortal>
            </PopupSubMenuRoot>
          </PopupMenuContent>
        </PopupMenuPortal>
      </PopupMenuRoot>
    );

    // Open the main menu
    fireEvent.click(screen.getByText("Trigger"));
    await screen.findByText("Submenu Trigger");

    vi.useFakeTimers();

    const submenuTrigger = screen.getByText("Submenu Trigger");

    // Hover over and then leave
    fireEvent.mouseEnter(submenuTrigger);
    fireEvent.mouseLeave(submenuTrigger);

    // Advance timers
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Flush promises
    await act(async () => {});

    // Check that it's not open
    expect(screen.queryByText("Sub Item 1")).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it("should not close the main menu when interacting with an open submenu", async () => {
    const onOpenChange = vi.fn();
    render(
      <PopupMenuRoot onOpenChange={onOpenChange}>
        <PopupMenuTrigger asChild>
          <button>Trigger</button>
        </PopupMenuTrigger>
        <PopupMenuPortal>
          <PopupMenuContent>
            <PopupSubMenuRoot>
              <PopupSubMenuTrigger>Submenu Trigger</PopupSubMenuTrigger>
              <PopupMenuPortal>
                <PopupSubMenuContent>
                  <PopupMenuItem>Sub Item 1</PopupMenuItem>
                </PopupSubMenuContent>
              </PopupMenuPortal>
            </PopupSubMenuRoot>
          </PopupMenuContent>
        </PopupMenuPortal>
      </PopupMenuRoot>
    );

    // Open the main menu
    fireEvent.click(screen.getByText("Trigger"));
    await screen.findByText("Submenu Trigger");
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    const submenuTrigger = screen.getByText("Submenu Trigger");

    // Open the submenu
    fireEvent.mouseEnter(submenuTrigger);
    await screen.findByText("Sub Item 1");

    // Click the submenu trigger again (should close the submenu but not the main menu)
    fireEvent.click(submenuTrigger);

    // Click inside the submenu content (should not close the main menu)
    // Re-open submenu first
    fireEvent.mouseEnter(submenuTrigger);
    await screen.findByText("Sub Item 1");
    fireEvent.click(screen.getByText("Sub Item 1"));

    // The onOpenChange for the main menu should not have been called with false
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });
});
