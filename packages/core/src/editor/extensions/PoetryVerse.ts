import { Node, mergeAttributes } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import PoetryVerseView from "../PoetryVerseView.vue";

export type PoetryLayout = "columns" | "interleaved";

export const PoetryHemistich = Node.create({
  name: "poetryHemistich",
  content: "inline*",
  defining: true,
  parseHTML: () => [{ tag: 'div[data-type="hemistich"]' }],
  renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "hemistich" }), 0],
});

export const PoetryLine = Node.create({
  name: "poetryLine",
  content: "poetryHemistich poetryHemistich",
  defining: true,
  parseHTML: () => [{ tag: 'div[data-type="poetry-line"]' }],
  renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "poetry-line" }), 0],
});

export const PoetryVerse = Node.create({
  name: "poetryVerse",
  group: "block",
  content: "poetryLine+",
  defining: true,

  addAttributes() {
    return { layout: { default: "columns" as PoetryLayout } };
  },
  parseHTML: () => [{ tag: 'div[data-type="poetry-verse"]' }],
  renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "poetry-verse" }), 0],
  addNodeView() { return VueNodeViewRenderer(PoetryVerseView as any); },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.command(({ state, dispatch }) => {
        const { $from } = state.selection;
        let lineDepth = -1;
        for (let depth = $from.depth; depth > 0; depth -= 1) {
          if ($from.node(depth).type.name === "poetryLine") { lineDepth = depth; break; }
        }
        if (lineDepth < 0) return false;
        const lineEnd = $from.after(lineDepth);
        const hemistich = state.schema.nodes.poetryHemistich!.create();
        const line = state.schema.nodes.poetryLine!.create(null, [hemistich, hemistich]);
        const tr = state.tr.insert(lineEnd, line).setSelection(TextSelection.near(state.tr.doc.resolve(lineEnd + 2)));
        dispatch?.(tr.scrollIntoView());
        return true;
      }),
      Backspace: () => this.editor.commands.command(({ state, dispatch }) => {
        const { $from } = state.selection;
        let lineDepth = -1;
        let verseDepth = -1;
        for (let depth = $from.depth; depth > 0; depth -= 1) {
          const name = $from.node(depth).type.name;
          if (lineDepth < 0 && name === "poetryLine") lineDepth = depth;
          if (name === "poetryVerse") { verseDepth = depth; break; }
        }
        if (lineDepth < 0 || verseDepth < 0 || $from.node(lineDepth).textContent) return false;
        const from = $from.before(lineDepth);
        const to = $from.after(lineDepth);
        const verse = $from.node(verseDepth);
        const tr = verse.childCount === 1
          ? state.tr.delete($from.before(verseDepth), $from.after(verseDepth))
          : state.tr.delete(from, to);
        dispatch?.(tr.scrollIntoView());
        return true;
      }),
    };
  },
});
