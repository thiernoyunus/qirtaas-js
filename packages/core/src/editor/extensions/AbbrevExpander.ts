import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { HONORIFICS, HONORIFIC_ABBREVIATIONS, type HonorificType } from "./Honorific";

export interface AbbrevExpanderOptions {
  abbreviations?: Record<string, string>;
}

export const DEFAULT_ABBREVIATIONS: Record<string, string> = {
  ...HONORIFIC_ABBREVIATIONS,
  "بسم1": "bismillah",
  "بسم2": "bismillah",
  "بسم3": "bismillah",
  "عز": "عَزَّ وَجَلَّ",
  "سبح": "سُبْحَانَهُ وَتَعَالَى",
  "جل": "جَلَّ وَعَلَا",
  "رح2": "رَحِمَهُمَا اللهُ",
  "رح11": "رَحِمَهَا اللهُ",
};

export const AbbrevExpander = Extension.create<AbbrevExpanderOptions>({
  name: "abbrevExpander",

  addOptions: () => ({ abbreviations: {} }),

  addProseMirrorPlugins() {
    const abbreviations = { ...DEFAULT_ABBREVIATIONS, ...this.options.abbreviations };
    const keys = Object.keys(abbreviations).sort((a, b) => b.length - a.length);
    return [new Plugin({
      props: {
        handleKeyDown: (view, event) => {
          if (event.key !== "Tab" && event.key !== "F3") return false;
          const { $from, empty } = view.state.selection;
          if (!empty || !$from.parent.isTextblock) return false;
          const before = $from.parent.textBetween(0, $from.parentOffset, undefined, "\ufffc");
          const abbreviation = keys.find((key) => before.endsWith(key));
          if (!abbreviation) return false;

          const expansion = abbreviations[abbreviation]!;
          const honorific = view.state.schema.nodes.honorific;
          const honorificType = expansion as HonorificType;
          const isHonorific = honorific && expansion in HONORIFICS;
          event.preventDefault();
          const from = $from.pos - abbreviation.length;
          const tr = expansion === ""
            ? view.state.tr.delete(from, $from.pos)
            : view.state.tr.replaceWith(
                from,
                $from.pos,
                isHonorific
                  ? honorific.create({ type: honorificType })
                  : view.state.schema.text(expansion),
              );
          view.dispatch(tr.scrollIntoView());
          return true;
        },
      },
    })];
  },
});
