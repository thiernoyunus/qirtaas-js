import { Node, mergeAttributes } from "@tiptap/core";

export const SectionEnd = Node.create({
  name: "sectionEnd",
  group: "block",
  atom: true,
  addAttributes() { return { variant: { default: "flower-row" } }; },
  parseHTML: () => [{ tag: 'div[data-type="section-end"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { "data-type": "section-end", style: "text-align:center" }),
    "❁ ❁ ❁",
  ],
});
