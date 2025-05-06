type SubMenuStackItem = {
  el: HTMLElement;
  close: () => void;
};

export class SubMenuRegistry {
  private stack: SubMenuStackItem[] = [];

  store(el: HTMLElement, close: () => void) {
    this.stack.push({ el, close });
  }

  pop(): HTMLElement | undefined {
    return this.stack.pop()?.el;
  }

  closeLast() {
    const last = this.stack[this.stack.length - 1];
    if (last) last.close();
  }

  clear() {
    this.stack = [];
  }
}

export const submenuRegistry = new SubMenuRegistry();
