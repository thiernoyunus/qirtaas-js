# Book Designer — Live Status

> Pick-up file. If a session dies, read [PLAN.md](./PLAN.md) then this file, and continue from the first unchecked item. Keep this file updated after every work chunk.

## Current phase: P0 — Spikes (go/no-go tests)

| # | Spike | Status | Artifacts |
|---|---|---|---|
| 1 | Paged.js: RTL A4 pages + footnotes-at-bottom + running heads + page numbers | ⏳ in progress | `spikes/p0/pagedjs-rtl-footnotes/index.html` |
| 2 | Honorific glyph rendering: U+FDFA/FDFB/FDFD, U+FD40–FD4F, ﴿﴾ across fonts | ⏳ in progress | `spikes/p0/honorifics/index.html` |
| 3 | Alt-key capture in browser (Alt+X/Q/W/M/0/9/K/L via event.code) | ⏳ in progress | `spikes/p0/altkeys/index.html` |

Verdicts land in `docs/book-designer/P0/VERDICTS.md` (with screenshots in `docs/book-designer/P0/screenshots/`).

## Done so far
- [x] Research: repo analysis, Ithraa .dotx dissection, design catalog → `docs/book-designer/*.md`
- [x] Plan written → `docs/book-designer/PLAN.md`
- [ ] P0 spikes built + browser-verified
- [ ] P0 verdicts reviewed → PLAN §9 open questions resolved
- [ ] P0 committed; P1 kickoff notes written

## Notes / constraints
- Fable usage is near its weekly cap — delegate implementation to Sonnet/GPT-5.6 subagents; Fable only reviews and decides (see PLAN §8).
- Spike 3 caveat: synthetic browser-automation key events may not reproduce real macOS Option-key composition. If automation is inconclusive, the test page logs keystrokes visually — ask the user to press the combos manually in the preview.
