import {
  createTag,
  Slot,
  Slottable,
  createSlot,
  createSlottable,
} from "./slot";

const TAGS = [
  "div",
  "span",
  "button",
  "input",
  "form",
  "label",
  "nav",
  "ul",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "section",
  "header",
  "footer",
  "img",
  "svg",
] as const;

type AnyTag = (typeof TAGS)[number];

type TagMap = {
  [K in AnyTag]: ReturnType<typeof createTag<K>>;
};

/**
 * A collection of common HTML tags with `asChild`, `as`, and `childProps` support.
 */
const Element = TAGS.reduce((acc, tag) => {
  acc[tag] = createTag(tag);
  return acc;
}, {} as TagMap);

export { Element, Slot, Slottable, createSlot, createSlottable, createTag };
