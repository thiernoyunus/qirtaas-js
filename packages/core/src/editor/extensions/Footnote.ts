import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import FootnoteView from "../FootnoteView.vue";

export type FootnoteBracketStyle = "parens" | "brackets";

/**
 * Inline footnote storage and document-order numbering. Per-page renumbering
 * belongs to the later book layout engine, not the editor document.
 */
export const Footnote = Node.create({
  name: "footnoteRef",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: { default: "" },
      content: { default: "" },
      bracketStyle: { default: "parens" as FootnoteBracketStyle },
      number: { default: 1, rendered: false },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="footnote"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-type": "footnote" }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(FootnoteView as any);
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (transactions, _oldState, newState) => {
          if (!transactions.some((transaction) => transaction.docChanged)) return null;
          let nextNumber = 1;
          const tr = newState.tr;
          newState.doc.descendants((node, pos) => {
            if (node.type.name !== this.name) return;
            if (node.attrs.number !== nextNumber) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, number: nextNumber });
            }
            nextNumber += 1;
          });
          return tr.docChanged ? tr : null;
        },
      }),
    ];
  },
});
