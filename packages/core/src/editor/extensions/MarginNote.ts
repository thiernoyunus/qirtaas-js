import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import MarginNoteView from "../MarginNoteView.vue";

export type MarginNoteSide = "right" | "left";

/**
 * Inline editor anchor for a margin note. True margin placement belongs to the
 * later book layout engine; the editor intentionally keeps this in the text.
 */
export const MarginNote = Node.create({
  name: "marginNote",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      side: {
        default: "right" as MarginNoteSide,
        parseHTML: (element) => element.getAttribute("data-side") ?? "right",
        renderHTML: (attributes) => ({ "data-side": attributes.side }),
      },
      text: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="margin-note"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": "margin-note",
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(MarginNoteView as any);
  },
});
