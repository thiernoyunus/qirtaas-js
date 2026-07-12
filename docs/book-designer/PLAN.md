# Islamic Book Designer — Build Plan

**Goal:** Let anyone create beautifully designed Islamic books (headings, footnotes, honorific symbols ﷺ, poetry layouts, chapter ornaments, table of contents) in the browser — no Microsoft Word, no hired designer. Built on top of the existing Qirtaas editor. Keyboard shortcuts stay familiar to Ithraa AlMotoon template users, and are fully customizable.

**Companion research (read these before building):**
- [repo-analysis.md](./repo-analysis.md) — what qirtaas-js already provides and where to plug in
- [dotx-inventory.md](./dotx-inventory.md) — every shortcut, abbreviation, style, and font in the Ithraa Word template
- [design-catalog.md](./design-catalog.md) — component taxonomy + 5 theme presets extracted from real Islamic book scans

---

## 1. Where we start from (verified facts)

**Qirtaas today** is an embeddable TipTap/ProseMirror rich-text editor (Vue 3 core, Vue + React wrappers) that already handles: Arabic rich text with per-node RTL/alignment, Qur'an verses, hadith blocks, mushaf clips, tables, images, slash commands — and honorifics ﷺ (U+FDFA) / ﷻ (U+FDFB) as atomic nodes inserted via `:saw:`-style shortcuts (`packages/core/src/editor/extensions/Honorific.ts`).

**Qirtaas does NOT have** (these are the product):
1. Footnotes
2. A page model (page size, margins, headers/footers, page numbers, pagination)
3. Book themes / ornaments / decorated headings (only `light|dark`)
4. Poetry (bayt) layouts
5. Auto table of contents
6. Chapter-end ornaments
7. Customizable keyboard shortcuts / abbreviation expansion
8. Any export (no PDF, no print, no getHTML — output is TipTap JSON only)

**Two structural constraints found in the repo:**
- There is **no plugin registry** — new TipTap extensions must be registered directly in `packages/core/src/editor/DocumentEditor.vue` (~lines 216–281), and toolbar/slash-menu entries edited in `EditorToolbar.vue` / `SlashCommand.ts`. Workstream A includes fixing this properly.
- ProseMirror disables font ligatures; qirtaas re-enables `liga/calt/rlig` only for Qur'an font classes (`DocumentEditor.vue:610-618`). Honorific ligatures in body text need the same treatment.
- The actual web app + backend live in a **separate private monorepo** (`CONTRIBUTING.md`). This plan covers the library packages; the app shell work is flagged where relevant.

## 2. What the Ithraa template actually does (so we replicate it faithfully)

From the `.dotx` dissection — **no macros exist**; everything is Word Building Blocks + key bindings, which means the whole feature set is replicable on the web:

| Ithraa shortcut | Inserts | Web replication strategy |
|---|---|---|
| Alt+X | footnote between `( )` | Real footnote node (Workstream B) |
| Alt+Z | footnote between `[ ]` | Same node, bracket-style option |
| Alt+Q | poem verse: 3-column single-row table | Dedicated `poetryVerse` node, layout variant `columns` |
| Alt+W | poem verse: 2-row interleaved table | Same node, layout variant `interleaved` |
| Alt+0 / Alt+9 | ornate quote marks `«` `»` in Traditional Arabic font | Insert real Unicode; for Qur'anic brackets use U+FD3E ﴾ / U+FD3F ﴿ |
| Alt+K / Alt+L | floating margin-heading text boxes (right/left margin) | Margin-note node, rendered by the page-layout engine (Workstream C) |
| Alt+M | 6-glyph chapter-end ornament (font "AGA Arabesque") | Themed SVG/Unicode divider node (e.g. ❁ U+2741 row) |
| `صفحة`+Enter / `عناصر`+Enter | title-page block / fiqh-issue outline block | Block templates in slash menu + abbreviation expander |
| *abbrev*+F3 (17 entries: ص1، ر1، رح1، بسم1…) | honorific/basmala glyphs | Abbreviation expander (Workstream D) |

**Critical symbol finding:** almost all Ithraa honorific glyphs are **Private Use Area codepoints (U+F021–U+F075) tied to the font "KFGQPC Arabic Symbols 01"** — they are meaningless without that font (they'd copy-paste as garbage). Only `ص2` inserts real Unicode U+FDFA ﷺ. Our strategy must be **Unicode-first**:

1. Map every honorific to its real Unicode codepoint where one exists: ﷺ U+FDFA, ﷻ U+FDFB, ﷽ U+FDFD, and the **Arabic Extended-B honorifics added in Unicode 14** (U+FD40–U+FD4F: رحمه الله، رضي الله عنه، عليه السلام variants, etc.).
2. Ship a webfont via `@font-face` that renders them (few system fonts cover U+FD40–FD4F yet — embed KFGQPC Arabic Symbols / an open font with coverage; verify licensing, KFGQPC fonts are distributed free by the King Fahd Complex).
3. Per-glyph SVG fallback inside the honorific node view for anything the font misses — the node view pattern already exists (`HonorificView.vue`).
4. **Export rule:** document JSON always stores real Unicode (or a named honorific type), never PUA codepoints. This keeps text searchable, copy-pasteable, and screen-reader safe.

## 3. Architecture (target)

```
┌────────────────────────────────────────────────────────┐
│  App shell (private monorepo): auth, doc list, sharing │
└──────────────────────┬─────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────┐
│ @qirtaas/core editor (TipTap)                          │
│  + NEW block nodes: footnote, poetryVerse, ornament,   │
│    marginNote, tocPlaceholder, titlePage, fiqhIssue    │
│  + NEW input layer: keymap service + abbrev expander   │
│  + extension registry (public API: pass extensions in) │
└──────────────────────┬─────────────────────────────────┘
                       │ TipTap JSON (design-agnostic content)
┌──────────────────────▼─────────────────────────────────┐
│ NEW @qirtaas/book-layout                               │
│  theme JSON (tokens + component variants + page spec)  │
│  JSON → themed HTML → Paged.js pagination:             │
│  pages, margins, running heads, page numbers,          │
│  footnotes-at-bottom, margin notes, TOC generation     │
└──────────────────────┬─────────────────────────────────┘
                       │ paginated HTML
        ┌──────────────┴──────────────┐
        ▼                             ▼
  Live book preview            PDF export (browser print
  (side panel / toggle)        first; server render later)
```

**Core principle: content and design are separate.** The document JSON says *what* something is (`heading level=bab`, `footnote`, `chapterEnd`); the **theme** says how it looks. Switching themes restyles the whole book with zero content edits — that's the "add a design and someone else uses it" requirement.

## 4. The theme spec (make designs contributable)

A theme is one JSON file + one SVG sprite/asset folder. Draft shape:

```jsonc
{
  "id": "classical-monochrome",
  "name": { "ar": "كلاسيكي أبيض وأسود", "en": "Classical Monochrome" },
  "page": { "size": "A4", "margins": "2.5cm", "runningHead": "title-rule-number", "pageNumber": "oval-cartouche" },
  "tokens": { "ink": "#1a1a1a", "accent": "#8a1538", "paper": "#ffffff", "bodyFont": "...naskh...", "displayFont": "...thuluth..." },
  "components": {
    "chapterOpener": { "variant": "arch-bracket", "color": "$accent" },   // parameterized SVG
    "headings": { "kitab": {...}, "bab": {...}, "fasl": {...}, "masala": {...} },
    "sectionEnd": { "variant": "flower-row", "glyphs": "❁❁❁❁" },
    "footnote": { "separator": "thin-rule", "numbering": "arabic-indic-parens", "scale": 0.7 },
    "quran": { "brackets": "ornate", "font": "uthmani" },
    "poetry": { "layout": "columns", "justify": "kashida" },
    "frame": { "cover": "toothed-triple", "body": "none" }
  }
}
```

- Ornaments (arch-bracket chapter opener, frames, dividers) are **parameterized SVG components** — the design catalog found the identical arch-bracket shape in two unrelated books, so shape is shared and only color/weight are themed.
- **Ship 5 presets** straight from the catalog: A Classical Monochrome, B Parchment & Indigo, C Modern Gradient Primer, D Deluxe Leather & Gold, E Plain Modern. Full component/color specs are in [design-catalog.md](./design-catalog.md).
- A theme validator (JSON Schema) + a "theme starter kit" doc make third-party design contributions possible without touching code.

## 5. Keyboard shortcuts & abbreviations (familiar + customizable)

- **Keymap service:** single user-editable map `{ action → key combo }`, defaults matching Ithraa (Alt+X footnote, Alt+Q/W poetry, Alt+M chapter end, Alt+0/9 brackets, Alt+K/L margin notes). Stored per user; settings UI with conflict detection.
  - ⚠️ Browser reality: on macOS, Option+letter types special characters, and some Alt combos are taken by browsers/OS. Intercept via ProseMirror keymap (`event.code`-based so macOS Option works), and let users remap anything. Every action is also reachable via the existing slash menu and toolbar, so shortcuts are an accelerator, never the only path.
- **Abbreviation expander** (the F3 workflow, made better): type `ص1` and hit the expand key (default Tab or F3 — configurable) → honorific node. Ship the full 17-entry Ithraa table + بسم1/2/3 as defaults; users can add their own abbreviations. Also auto-suggest: typing an abbreviation shows an inline hint of the glyph.
- Keep existing `:saw:` input rules working.

## 6. Workstreams

Independent enough to run in parallel after A lands its API decisions.

### A. Core editor plumbing (prerequisite, small)
1. Add an **extension registry** so new nodes/toolbar/slash items register without editing `DocumentEditor.vue` internals; expose `extensions` in public mount options (`mount/types.ts`).
2. Re-enable ligatures (`rlig/liga/calt`) for body/honorific text, not just Qur'an classes.
3. Add public `getHTML()` (needed by the layout engine and export).

### B. Content block nodes (TipTap extensions, follow `HadithNode.ts` pattern)
1. **Footnote**: inline reference mark + footnote-content storage; Arabic-Indic numbering `(١)`; bracket style `()`/`[]` per Ithraa; per-page renumber happens at layout time, in-editor numbering is document-order.
2. **PoetryVerse**: sadr/ajuz hemistich pairs; layout variants `columns` (Alt+Q) and `interleaved` (Alt+W); kashida-friendly justification.
3. **Ornament/SectionEnd**: semantic node, theme decides the glyph row/SVG.
4. **MarginNote** (Alt+K/L equivalent): inline anchor + side attribute; plain inline render in editor, true margin placement at layout time.
5. **Heading semantics**: extend headings with `kind` (kitab/bab/fasl/masala) so themes can style each level distinctly and TOC can build itself.
6. **TitlePage / FiqhIssue** block templates (the `صفحة` / `عناصر` builders) as slash-menu snippets.
7. **Honorific expansion**: add the Unicode-14 honorific set + SVG fallback + Unicode-first storage rule (§2).

### C. Book layout engine (`@qirtaas/book-layout`, new package)
1. Theme JSON spec + schema validator + the 5 preset themes + parameterized SVG ornament components.
2. Renderer: TipTap JSON → themed semantic HTML.
3. Pagination via **Paged.js** (CSS Paged Media polyfill, runs in-browser, free): page size/margins, running heads, page numbers, footnotes at page bottom (Paged.js footnote support is the riskiest piece — spike it FIRST; fallback is a custom footnote-placement pass), margin notes, section-start page breaks.
4. TOC generation from heading nodes (with real page numbers post-pagination).
5. Live preview component (editor ↔ book preview toggle or side-by-side).

### D. Input layer
1. Keymap service + settings UI (defaults = Ithraa table).
2. Abbreviation expander + user-defined entries.

### E. Export & fonts
1. Font pipeline: naskh body + display + Uthmani + honorific-symbols webfonts, subsetting, license audit (KFGQPC = free; **do not** ship AGA Arabesque — replace its ornaments with SVG/Unicode).
2. PDF v1: Paged.js output → browser print-to-PDF (zero infra).
3. PDF v2 (later, in app monorepo): headless-Chrome server render for one-click download + embedded fonts guaranteed.

### F. App shell (private monorepo — separate effort)
Theme picker/gallery, book metadata (title/author/colophon), shortcut settings page, export button, theme-contribution upload+validation.

## 7. Phasing

| Phase | Delivers | Contents |
|---|---|---|
| **P0 — Spike (do first)** | go/no-go on the risky bits | Paged.js footnotes-at-bottom + RTL pages proof; Unicode-14 honorific font rendering test on Mac/Windows/iOS; Alt-key capture test on macOS browsers |
| **P1 — Author like Ithraa** | Word-template parity in the browser | Workstreams A, B, D — footnotes, poetry, honorifics, ornaments, shortcuts, abbreviations |
| **P2 — Looks like a book** | themed paginated preview | Workstream C + theme presets A–E, TOC, margin notes |
| **P3 — Ship a book** | PDF export + polish | Workstream E, font subsetting, print QA against the reference scans |
| **P4 — Ecosystem** | third-party designs | theme starter kit, validator, gallery (F) |

**Definition of done for P3:** recreate 3–5 pages of one of the reference books (e.g. the Uthaymeen sharh) end-to-end in the app and export a PDF a reader can't tell apart at arm's length.

## 8. Delegation map (per the model table)

- **Fable / Opus 4.8**: theme JSON spec review, Paged.js spike verdict, final review of each phase.
- **GPT-5.6 (Codex)**: bulk implementation with clear specs — TipTap nodes (B), keymap service (D), Paged.js wiring (C.3), font pipeline (E).
- **Sonnet 5 / Opus 4.8** (taste ≥ 7): SVG ornament components, theme presets, preview UI, settings UI copy (Arabic + English).
- Reviews: `/codex:review` as the extra independent pass on every workstream PR.

## 9. Open questions (decide during P0)

1. ✅ **DECIDED (P0, 2026-07-12): Paged.js is a GO** — RTL pages, per-page bottom footnotes, running heads, and page numbers all verified working (`docs/book-designer/P0/VERDICTS.md`). Two conditions from the spike: (a) the layout engine must emit **explicit `break-before: page` at kitab/bab boundaries** — natural overflow-driven pagination was unreliably slow; re-test performance on a chapter-length document early in P1; (b) footnote marker CSS must use the combined-declaration workaround documented in VERDICTS.md (Paged.js drops `::footnote-marker`/`::footnote-call` sub-rules). Server-side typesetter stays as an export-only fallback if P1 perf testing fails.
2. Default expand key for abbreviations (F3 is awkward on Mac laptops — Tab? Space-after-match?).
3. Whether the extension registry (A.1) ships as public API or stays internal to first-party packages initially.
4. Uthmani Qur'an text inside themed pages: keep qirtaas's hosted-content dependency or bundle offline data for export fidelity.
