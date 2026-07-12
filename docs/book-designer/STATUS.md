# Book Designer — Live Status

> Pick-up file. If a session dies, read [PLAN.md](./PLAN.md) then this file, and continue from the first unchecked item. Keep this file updated after every work chunk.

## Current phase: P0 — Spikes (go/no-go tests)

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
