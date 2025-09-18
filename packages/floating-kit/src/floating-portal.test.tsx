import { render, screen } from "@testing-library/react";
import { FloatingPortal } from "./floating-portal";
import { FloatingRoot } from "./floating-root";
import { describe, it, expect } from "vitest";
import React from "react";

describe("FloatingPortal", () => {
  it("should render children in a portal", () => {
    render(
      <FloatingRoot>
        <FloatingPortal>
          <div>Portal Content</div>
        </FloatingPortal>
      </FloatingRoot>
    );

    expect(screen.getByText("Portal Content")).toBeInTheDocument();
  });

  it("should render children in a specific container", () => {
    const container = document.createElement("div");
    container.id = "portal-container";
    document.body.appendChild(container);

    render(
      <FloatingRoot>
        <FloatingPortal to={container}>
          <div>Portal Content</div>
        </FloatingPortal>
      </FloatingRoot>
    );

    expect(container).toContainElement(screen.getByText("Portal Content"));
    document.body.removeChild(container);
  });
});
