import { Node, mergeAttributes, InputRule, nodePasteRule } from "@tiptap/core";
import { Fragment, type Schema } from "@tiptap/pm/model";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import HonorificView from "../HonorificView.vue";

export const HONORIFICS = {
  jj: { glyph: "ﷻ", phrase: "جل جلاله", abbreviations: [] },
  saw: { glyph: "ﷺ", phrase: "صلى الله عليه وسلم", abbreviations: ["ص1", "ص2"] },
  rahimahu: { glyph: "﵀", phrase: "رحمه الله", abbreviations: ["رح1"] },
  radiAnhu: { glyph: "﵁", phrase: "رضي الله عنه", abbreviations: ["ر1"] },
  radiAnha: { glyph: "﵂", phrase: "رضي الله عنها", abbreviations: ["ر11"] },
  radiAnhum: { glyph: "﵃", phrase: "رضي الله عنهم", abbreviations: ["ر3"] },
  radiAnhuma: { glyph: "﵄", phrase: "رضي الله عنهما", abbreviations: ["ر2"] },
  radiAnhunna: { glyph: "﵅", phrase: "رضي الله عنهن", abbreviations: ["ر33"] },
  sallaAlayhiWaAlih: { glyph: "﵆", phrase: "صلى الله عليه وآله", abbreviations: [] },
  alayhiSalam: { glyph: "﵇", phrase: "عليه السلام", abbreviations: ["ع1"] },
  alayhimSalam: { glyph: "﵈", phrase: "عليهم السلام", abbreviations: ["ع3"] },
  alayhimaSalam: { glyph: "﵉", phrase: "عليهما السلام", abbreviations: ["ع2"] },
  alayhiSalatuWasSalam: { glyph: "﵊", phrase: "عليه الصلاة والسلام", abbreviations: [] },
  quddisaSirrah: { glyph: "﵋", phrase: "قدس سره", abbreviations: [] },
  sallaAlayhiWaAlihiWasallam: { glyph: "﵌", phrase: "صلى الله عليه وآله وسلم", abbreviations: [] },
  alayhaSalam: { glyph: "﵍", phrase: "عليها السلام", abbreviations: ["ع11"] },
  tabarakaWaTaala: { glyph: "﵎", phrase: "تبارك وتعالى", abbreviations: [] },
  rahimahum: { glyph: "﵏", phrase: "رحمهم الله", abbreviations: ["رح3"] },
  bismillah: { glyph: "﷽", phrase: "بسم الله الرحمن الرحيم", abbreviations: ["بسم1", "بسم2", "بسم3"] },
} as const;

export type HonorificType = keyof typeof HONORIFICS;

const SHORTCODE_MAP: Record<string, HonorificType> = {
  saws: "saw", صلع: "saw", صلى: "saw", جل: "jj",
  ...Object.fromEntries(
    Object.entries(HONORIFICS).flatMap(([type, value]) => [
      [type, type],
      ...value.abbreviations.map((abbreviation) => [abbreviation, type]),
    ]),
  ),
} as Record<string, HonorificType>;

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const shortcodeKeys = Object.keys(SHORTCODE_MAP).map(escapeRegex).join("|");
const abbreviationKeys = Object.entries(HONORIFICS)
  .flatMap(([type, value]) => value.abbreviations.map((abbreviation) => [abbreviation, type] as const));
export const HONORIFIC_ABBREVIATIONS = Object.fromEntries(abbreviationKeys) as Record<string, HonorificType>;
// TODO(book-designer): Ithraa abbreviations عز, سبح, جل, رح2, and رح11 have
// no exact standard ligature in U+FD40–U+FD4F. Keep them as text until a
// Unicode-first product decision is made; never substitute their old PUA glyphs.
const abbreviationRegex = new RegExp(`(?:^|\\s)(?<abbreviation>${Object.keys(HONORIFIC_ABBREVIATIONS).map(escapeRegex).join("|")}) $`);
const inputRegex = new RegExp(`:(?<shortcode>${shortcodeKeys}):$`);
const pasteRegex = new RegExp(`:(?<shortcode>${shortcodeKeys}):`, "g");

/** Parses :shortcode: patterns into real-Unicode honorific nodes. */
export function parseReplacementText(text: string, schema: Schema): Fragment {
  if (!schema.nodes.honorific) return Fragment.from(text ? schema.text(text) : []);
  const regex = new RegExp(`:(?:${shortcodeKeys}):`, "g");
  const nodes: import("@tiptap/pm/model").Node[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(regex)) {
    const before = text.slice(lastIndex, match.index);
    if (before) nodes.push(schema.text(before));
    const type = SHORTCODE_MAP[match[0].slice(1, -1)];
    if (type) nodes.push(schema.nodes.honorific.create({ type }));
    lastIndex = match.index! + match[0].length;
  }
  const after = text.slice(lastIndex);
  if (after) nodes.push(schema.text(after));
  return Fragment.from(nodes);
}

export const Honorific = Node.create({
  name: "honorific", group: "inline", inline: true, atom: true,
  addAttributes() { return { type: { default: "jj" as HonorificType } }; },
  parseHTML() { return [{ tag: 'span[data-type="honorific"]' }]; },
  renderHTML({ HTMLAttributes }) {
    const type = HTMLAttributes.type as HonorificType;
    const item = HONORIFICS[type] ?? HONORIFICS.jj;
    return ["span", mergeAttributes(HTMLAttributes, { "data-type": "honorific", title: item.phrase }), item.glyph];
  },
  addNodeView() { return VueNodeViewRenderer(HonorificView as any); },
  addPasteRules() {
    return [nodePasteRule({ find: pasteRegex, type: this.type, getAttributes: (match) => ({ type: SHORTCODE_MAP[match[0].slice(1, -1)] }) })];
  },
  addInputRules() {
    const insert = (type: HonorificType, state: Parameters<NonNullable<ConstructorParameters<typeof InputRule>[0]["handler"]>>[0]["state"], range: { from: number; to: number }, keepSpace = false) => {
      const node = state.schema.nodes.honorific?.create({ type });
      if (!node) return;
      state.tr.replaceWith(range.from, range.to, keepSpace ? Fragment.fromArray([node, state.schema.text(" ")]) : node);
      state.tr.setMeta("honorific", true);
    };
    return [
      new InputRule({ find: inputRegex, handler: ({ state, range, match }) => {
        const type = match.groups?.shortcode ? SHORTCODE_MAP[match.groups.shortcode] : undefined;
        if (type) insert(type, state, range);
      } }),
      new InputRule({ find: abbreviationRegex, handler: ({ state, range, match }) => {
        const abbreviation = match.groups?.abbreviation;
        const type = abbreviation ? HONORIFIC_ABBREVIATIONS[abbreviation] : undefined;
        if (type) insert(type, state, { from: range.to - abbreviation!.length - 1, to: range.to }, true);
      } }),
    ];
  },
});
