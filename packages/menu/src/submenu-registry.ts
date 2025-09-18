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

  get(): HTMLElement | undefined {
    return this.stack.at(-1)?.el;
  }

  closeLast() {
    const last = this.stack.at(-1);
    if (last) last.close();
  }

  clear() {
    this.stack = [];
  }
}

export const SubmenuRegistry = new SubMenuRegistry();
