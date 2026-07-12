import Heading from "@tiptap/extension-heading";

export type HeadingKind = "kitab" | "bab" | "fasl" | "masala" | null;

export const BookHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      kind: {
        default: null as HeadingKind,
        parseHTML: (element) => element.getAttribute("data-kind"),
        renderHTML: (attrs) => attrs.kind ? { "data-kind": attrs.kind } : {},
      },
    };
  },
});
