# @pras-ui/slot

A slot utility package that wraps [`@radix-ui/react-slot`](https://www.radix-ui.com/) with additional features. When using `createTag`, your components will gain support for `asChild`, `as`, and `childProps` props. This small yet powerful extension is built to enhance flexibility and composability within [`pras-ui`](#not-released-yet).

---

## 📦 Installation

```bash
npm install @pras-ui/slot
# or
yarn add @pras-ui/slot
# or
bun add @pras-ui/slot
```

---

## 🧩 API

### `Slot` & `Slottable`

`Slot` and `Slottable` work together to manage dynamic content insertion and prop forwarding. While `Slot` can work independently, use `Slottable` when `Slot` wraps multiple children to ensure the correct one receives the props.

```tsx
import { Slot, Slottable } from "@pras-ui/slot";

function ButtonWrapper({ children, ...props }) {
  return (
    <Slot {...props}>
      <Slottable>
        <div>child 1</div>
      </Slottable>
      <div>child 2</div>
    </Slot>
  );
}

// Props like `onClick` will be passed into the Slottable child
<ButtonWrapper onClick={() => console.log("clicked")}>  
  <button>Press</button>  
</ButtonWrapper>;
```

---

### `createTag`

`createTag` returns a component that supports flexible rendering via:

- `asChild`: forwards all props and refs to its only child
- `as`: replaces the rendered element/tag
- `childProps`: injects selective props into the child, without passing all parent props

> Note: If `asChild` is `true`, `childProps` will be ignored. `childProps` only applies when `asChild` is `false`.

#### Props

| Name         | Type                                  | Description                                                |
|--------------|----------------------------------------|------------------------------------------------------------|
| `asChild`    | `boolean`                              | Forwards all props and refs to the only child element      |
| `as`         | `React.ElementType`                    | Overrides the rendered HTML/React tag                      |
| `childProps` | `Partial<ComponentProps<E>> & object`  | Injects props into the child when not using `asChild`      |

#### Example

```tsx
import { createTag } from '@pras-ui/slot';

const Box = createTag('div');

// Default usage (renders as a div)
<Box className="bg-gray-100">Hello</Box>

// Render as a different tag
<Box as="section">I'm a section</Box>

// Forward props to child element
<Box asChild>
  <button onClick={() => alert('clicked')}>Click me</button>
</Box>

// Inject child-specific props only
<Box
  className="bg-gray-100" // only applies to Box
  childProps={{ onClick: () => alert('clicked') }} // only applies to child
>
  <button>Click me</button>
</Box>
```

---

### `createSlot` & `createSlottable`

These helpers allow you to create namespaced Slot and Slottable components:

```tsx
const MySlot = createSlot("MyCustomSlot");
const MySlottable = createSlottable("MyCustomSlot");
```

This is useful for managing multiple Slot contexts or scoped slot logic.

---

## Notes

For more low-level details, refer to the official [`@radix-ui/react-slot` documentation](https://www.radix-ui.com/primitives/docs/utilities/slot).