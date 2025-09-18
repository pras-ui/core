import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Element } from './index';

describe('@pras-ui/slot', () => {
  it('should render the default tag', () => {
    render(<Element.div data-testid="test-element" />);
    const element = screen.getByTestId('test-element');
    expect(element.tagName).toBe('DIV');
  });

  it('should render the tag specified by the "as" prop', () => {
    render(<Element.div as="span" data-testid="test-element" />);
    const element = screen.getByTestId('test-element');
    expect(element.tagName).toBe('SPAN');
  });

  it('should forward props to the child when "asChild" is true', () => {
    render(
      <Element.div asChild data-testid="test-element">
        <button>Click me</button>
      </Element.div>
    );
    const button = screen.getByTestId('test-element');
    expect(button.tagName).toBe('BUTTON');
    expect(screen.queryByRole('div')).toBeNull();
  });

  it('should merge props with the child when "asChild" is true', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Element.div asChild onClick={handleClick}>
        <button>Click me</button>
      </Element.div>
    );
    const button = screen.getByRole('button');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should inject props into the child using "childProps"', () => {
    render(
      <Element.div childProps={{ 'data-testid': 'child' }}>
        <button>Child</button>
      </Element.div>
    );
    expect(screen.getByTestId('child').tagName).toBe('BUTTON');
  });

  it('should not pass "childProps" to the wrapper element', () => {
    render(
      <Element.div data-testid="wrapper" childProps={{ id: 'child' }}>
        <button>Child</button>
      </Element.div>
    );
    expect(screen.getByTestId('wrapper')).not.toHaveAttribute('id', 'child');
    expect(screen.getByRole('button')).toHaveAttribute('id', 'child');
  });

  it('should merge refs when using "childProps"', () => {
    const wrapperRef = React.createRef<HTMLDivElement>();
    const childRef = React.createRef<HTMLButtonElement>();

    render(
      <Element.div ref={wrapperRef} childProps={{ ref: childRef }}>
        <button>Child</button>
      </Element.div>
    );

    expect(wrapperRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(childRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(wrapperRef.current).toBe(childRef.current);
  });

  it('should warn when using "asChild" and "childProps" together', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Element.div asChild childProps={{ id: 'child' }}>
        <button>Child</button>
      </Element.div>
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "You cannot use both 'asChild' and 'childProps'. 'childProps' will be ignored."
    );
    consoleWarnSpy.mockRestore();
  });
});
