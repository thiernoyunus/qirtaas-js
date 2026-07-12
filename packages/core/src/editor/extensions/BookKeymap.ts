import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

export type KeymapAction =
  | { type: "footnote"; bracketStyle: "parens" | "brackets" }
  | { type: "poetry"; layout: "columns" | "interleaved" }
  | { type: "sectionEnd" }
  | { type: "insertText"; text: string }
  | { type: "marginNote"; side: "right" | "left" };

export interface BookKeymapOptions {
  bindings?: Record<string, KeymapAction | false>;
}

export const DEFAULT_BOOK_BINDINGS: Record<string, KeymapAction> = {
  "Alt+KeyX": { type: "footnote", bracketStyle: "parens" },
  "Alt+KeyZ": { type: "footnote", bracketStyle: "brackets" },
  "Alt+KeyQ": { type: "poetry", layout: "columns" },
  "Alt+KeyW": { type: "poetry", layout: "interleaved" },
  "Alt+KeyM": { type: "sectionEnd" },
  "Alt+Digit0": { type: "insertText", text: "«" },
  "Alt+Numpad0": { type: "insertText", text: "«" },
  "Alt+Digit9": { type: "insertText", text: "»" },
  "Alt+Numpad9": { type: "insertText", text: "»" },
  "Alt+KeyK": { type: "marginNote", side: "right" },
  "Alt+KeyL": { type: "marginNote", side: "left" },
};

function poetryVerse(layout: "columns" | "interleaved") {
  const hemistich = () => ({ type: "poetryHemistich" });
  return {
    type: "poetryVerse",
    attrs: { layout },
    content: [{ type: "poetryLine", content: [hemistich(), hemistich()] }],
  };
}

export const BookKeymap = Extension.create<BookKeymapOptions>({
  name: "bookKeymap",

  addOptions: () => ({ bindings: {} }),

  addProseMirrorPlugins() {
    const bindings = { ...DEFAULT_BOOK_BINDINGS, ...this.options.bindings };
    return [new Plugin({
      props: {
        handleKeyDown: (_view, event) => {
          // Alt only — combos with Ctrl/Meta (e.g. Cmd+Option+X) stay with the OS/browser.
          if (!event.altKey || event.ctrlKey || event.metaKey) return false;
          const action = bindings[`Alt+${event.code}`];
          if (!action) return false;
          event.preventDefault();

          const chain = this.editor.chain().focus();
          if (action.type === "footnote") {
            return chain.insertContent({
              type: "footnoteRef",
              attrs: { id: crypto.randomUUID(), content: "", bracketStyle: action.bracketStyle },
            }).run();
          }
          if (action.type === "poetry") return chain.insertContent(poetryVerse(action.layout)).run();
          if (action.type === "sectionEnd") return chain.insertContent({ type: "sectionEnd" }).run();
          if (action.type === "insertText") return chain.insertContent(action.text).run();
          return chain.insertContent({ type: "marginNote", attrs: { side: action.side, text: "" } }).run();
        },
      },
    })];
  },
});
