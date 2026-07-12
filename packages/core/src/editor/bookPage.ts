// Shared book-mode page geometry (P2 Layer 1 + 2, docs/book-designer/PLAN.md
// §5b). A4 at 96 CSS px/inch, 2.5cm margins — matches the page-surface CSS in
// DocumentEditor.vue (`.qirtaas-page-mode-book .tiptap`) so the CSS-painted
// page (before the pagination plugin measures anything) and the
// tiptap-pagination-plus page geometry (Layer 2, pixel-based) agree.
const PX_PER_CM = 96 / 2.54;

export const BOOK_PAGE_PX = {
  /** Full A4 page width (21cm), including the left/right margins below. */
  width: Math.round(21 * PX_PER_CM),
  /** Full A4 page height (29.7cm), including the top/bottom margins below. */
  height: Math.round(29.7 * PX_PER_CM),
  /** 2.5cm margin on every side, matching the Layer 1 CSS page surface. */
  margin: Math.round(2.5 * PX_PER_CM),
} as const;
