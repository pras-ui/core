import { render, screen } from "@testing-library/react";
import { Portal } from "./Portal";
import { describe, it, expect } from "vitest";
import React from "react";

describe("Portal", () => {
  it("should render children in a portal", () => {
    render(
      <Portal>
        <div>Portal Content</div>
      </Portal>
    );
    expect(screen.getByText("Portal Content")).toBeInTheDocument();
  });

  it("should render children in a specific container", () => {
    const container = document.createElement("div");
    container.id = "portal-container";
    document.body.appendChild(container);

    render(
      <Portal to={container}>
        <div>Portal Content</div>
      </Portal>
    );

    expect(container).toContainElement(screen.getByText("Portal Content"));
    document.body.removeChild(container);
  });
});
