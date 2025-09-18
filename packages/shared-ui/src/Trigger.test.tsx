import { render, screen } from "@testing-library/react";
import { Trigger } from "./Trigger";
import { describe, it, expect } from "vitest";
import React from "react";

describe("Trigger", () => {
  it("should render a button", () => {
    render(<Trigger>Click me</Trigger>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("should forward refs", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Trigger ref={ref}>Click me</Trigger>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
