# Book Designer — Live Status

> Pick-up file. If a session dies, read [PLAN.md](./PLAN.md) then this file, and continue from the first unchecked item. Keep this file updated after every work chunk.

## Current phase: P1 — Author like Ithraa (Word-template parity in the browser)

Branch: `book-designer/p1-editor-extensions` (off the P0 PR branch). PLAN §6 workstreams A, B, D, split into sequential chunks — each chunk = one delegated agent, build must pass, committed before the next starts (all touch `DocumentEditor.vue` registration, so no parallel chunks).

| Chunk | Scope | Status |
|---|---|---|
| 1 | **A: plumbing** — extension registry (public `extensions` mount option), enable `liga/calt/rlig` ligatures for body text (currently Qur'an-only, `DocumentEditor.vue:610-618`), public `getHTML()` on the editor handle, backend-free demo harness page (`spikes/p1-demo/`) | ✅ done (Codex impl; build + browser-verified: demo mounts backend-free via `initialContent`, custom extension registers, ligatures active. Tradeoff: ligatures now on for ALL editor text incl. Latin — rescope if Latin cursor quirks appear) |
| 2 | **B: block nodes** — footnote (std element, NOT `<fn>`; Arabic-Indic `(١)` markers), poetryVerse (columns + interleaved variants), sectionEnd ornament, heading `kind` attr (kitab/bab/fasl/masala), Unicode-14 honorific set (U+FD40–FD4F); webfont/SVG-fallback asset sourcing deferred to chunk 4 | ✅ done (Codex impl; build + browser-verified: all nodes render, honorifics stored as real Unicode — U+FD40–FD4F mappings independently checked correct. TODO left in code: عز وجل/سبحانه وتعالى/جل وعلا/رحمها/رحمهما have no single Unicode codepoint — need multi-char or SVG treatment in chunk 4) |
| 3 | **D: input layer** — keymap service (Ithraa defaults Alt+X/Z/Q/W/M/0/9/K/L, `event.code`-matched, MUST accept `Numpad0-9` AND `Digit0-9`, user-remappable) + abbreviation expander (17 Ithraa entries: ص1، ر1، رح1، بسم1…) | ✅ done (Codex impl; full workspace build passes. Public `keymap`/`abbreviations` options and demo overrides verified through generated types; five PUA-only Ithraa forms remain excluded per chunk 2's Unicode-safe decision) |
| 4 | **B leftovers** — marginNote node (wire Alt+K/L), titlePage/fiqhIssue slash-menu templates, plain-text expansions for the 5 no-codepoint phrases (عز وجل، سبحانه وتعالى، جل وعلا، رحمها الله، رحمهما الله → real words, not ligatures). Honorific webfont sourcing moved to P2 asset pass (needs network + cross-platform verification) | ✅ done (Codex impl; build + browser-verified: Alt+K margin note inserts, عز+Tab expands to عَزَّ وَجَلَّ) |

**P1 COMPLETE (2026-07-12).** The editor now has Word/Ithraa parity: footnotes, both poetry layouts, section-end ornaments, heading kinds, margin notes, full honorific set (Unicode-first), configurable Alt-shortcuts, and Tab/F3 abbreviation expansion — all demoed in `spikes/p1-demo/`.

**PR review pass (2026-07-12):** PR #2 got automated review from Gemini Code Assist + Codex. 7 real bugs fixed (chunk 5, `book-designer/p1-editor-extensions`): footnote/margin-note popover Backspace/Enter/click no longer corrupts the main document (event bubbling stopped — critical, browser-verified); `crypto.randomUUID()` replaced with a safe fallback at 3 call sites (crashed on plain-HTTP local-network testing); Arabic ligatures scoped to `[dir="rtl"]` only (was leaking into Latin text, risking cursor bugs); poetry-line Backspace now sets a valid cursor position after deleting; empty custom-abbreviation expansions delete the range instead of crashing ProseMirror; footnote/margin-note popovers now gate on `editor.isEditable` so read-only/renderer mode can't be edited; React/Vue wrappers now forward the `keymap`/`abbreviations` options (previously only `extensions` was threaded through). Deferred to P2 as documented, non-blocking: `getHTML()` doesn't serialize NodeView atom content (footnote/margin/quran/hadith text missing from HTML output — pre-existing limitation, not a new regression), `SectionEnd`'s `variant` attribute has no visual effect yet (cosmetic, themes will drive this in P2).

**PR #2 second review pass (2026-07-12):** after the chunk-5 bug fixes were pushed, bots re-reviewed and found 2 more real bugs, both fixed: (1) footnotes loaded from existing content (not typed) kept wrong/default numbers until the first edit — fixed by renumbering once on plugin-view init, not just on doc-change transactions; verified live (two un-numbered footnotes loaded as `[1,2]` with zero edits, confirmed against the pre-fix bug of `[1,1]`); (2) footnote/margin-note popovers didn't react to `setEditable()` being called after mount (stale `isEditable` since NodeViews render outside the normal Vue reactivity tree) — fixed by subscribing to the TipTap editor's `update` event, confirmed against installed library source that `setEditable()` does emit it.

Next: **P2 — book layout engine** (`@qirtaas/book-layout` package: theme JSON spec, 5 presets, Paged.js pagination with explicit section breaks, TOC, live preview — PLAN §6 Workstream C) plus the honorific webfont asset pass.

## P0 — Spikes (go/no-go tests) ✅ COMPLETE

| # | Spike | Status | Artifacts |
|---|---|---|---|
| 1 | Paged.js: RTL A4 pages + footnotes-at-bottom + running heads + page numbers | ⚠️ PARTIAL | `spikes/p0/pagedjs-rtl-footnotes/index.html` — works once forced page-breaks + a footnote-CSS gotcha are handled; natural overflow pagination was unreliably slow, needs perf re-test on chapter-length docs |
| 2 | Honorific glyph rendering: U+FDFA/FDFB/FDFD, U+FD40–FD4F, ﴿﴾ across fonts | ⚠️ PARTIAL | `spikes/p0/honorifics/index.html` — all codepoints render on macOS via system fallback with zero custom fonts, but test can't isolate per-font coverage; Windows/Android unverified |
| 3 | Alt-key capture in browser (Alt+X/Q/W/M/0/9/K/L via event.code) | ✅ PASS (manual, Chrome/macOS 2026-07-12) | User physically tested: Option+X and Option+M matched via event.code, preventDefault blocked the composed ≈/µ chars from leaking. Caveat: numpad digits report `Numpad0`/`Numpad9` — the real keymap service MUST match Numpad* codes in addition to Digit*. Safari untested (optional). |

Verdicts land in `docs/book-designer/P0/VERDICTS.md` (with screenshots in `docs/book-designer/P0/screenshots/`).

## Done so far
- [x] Research: repo analysis, Ithraa .dotx dissection, design catalog → `docs/book-designer/*.md`
- [x] Plan written → `docs/book-designer/PLAN.md`
- [x] P0 spikes built + browser-verified (all three PARTIAL — see table + `P0/VERDICTS.md`)
- [x] P0 verdicts reviewed; Fable independently re-verified Spike 1 in-browser (2 pages, footnotes collect on their own page, RTL, running head) → PLAN §9 Q1 resolved: **Paged.js is a GO** with explicit page-breaks at section boundaries
- [ ] P0 committed; P1 kickoff notes written

## Remaining P0 items (need a human or another platform)
- ~~Spike 3 manual test~~ ✅ DONE 2026-07-12 (Chrome/macOS): event.code matching + preventDefault works on real hardware; no composed-char leaks on matched combos. New requirement for P1 keymap service: match `Numpad0-9` as well as `Digit0-9`.
- **Spike 2 cross-platform**: open `http://localhost:8123/spikes/p0/honorifics/` on Windows and Android; macOS renders all 21 honorific codepoints via system fallback, other platforms unverified. Until verified, P1 ships a webfont for honorifics regardless (safe default).

## P0 decisions already made
- Paged.js: GO, with explicit `break-before: page` at kitab/bab boundaries + footnote-CSS workaround (PLAN §9.1, P0/VERDICTS.md).
- No KFGQPC font files exist in the user's template folders — the Unicode-first honorific strategy (PLAN §2) stands; bundle an open webfont with U+FD40–FD4F coverage in P1.

## Notes / constraints
- Fable usage is near its weekly cap — delegate implementation to Sonnet/GPT-5.6 subagents; Fable only reviews and decides (see PLAN §8).
- Spike 3 caveat: synthetic browser-automation key events may not reproduce real macOS Option-key composition. If automation is inconclusive, the test page logs keystrokes visually — ask the user to press the combos manually in the preview.
