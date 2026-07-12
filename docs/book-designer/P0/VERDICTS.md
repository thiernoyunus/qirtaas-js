# P0 Spike Verdicts

All three spikes were built under `spikes/p0/` and verified in-browser (Chromium-based
preview pane, macOS host, served via `python3 -m http.server 8123` from the repo root).
No source files were modified; only spike files and this doc were added.

**Screenshot note:** the browser tool used for verification can *show* screenshots but
this agent has no path to persist them as PNG files under
`docs/book-designer/P0/screenshots/` (no image-file-write capability was available in
this session). `docs/book-designer/P0/screenshots/README.md` records this gap. All
findings below are backed instead by direct DOM/computed-style inspection (quoted
verbatim) plus a description of what each screenshot showed — evidence you can
reproduce yourself by opening the spike files in a browser.

---

## Spike 1 — Paged.js: RTL A4 pages + footnotes-at-bottom + running heads + page numbers

**File:** `spikes/p0/pagedjs-rtl-footnotes/index.html`
**Question:** can Paged.js paginate an RTL Arabic book with footnotes at the bottom of
each page, running heads, and page numbers?

### Verdict: **PARTIAL** (works correctly once you know two non-obvious gotchas; reliability/performance under automation was inconsistent)

### What works (confirmed)

- **RTL layout:** `dir="rtl" lang="ar"` body renders right-aligned, justified Arabic
  text correctly on every page.
- **Footnotes land on the correct page:** all 6 `float: footnote` (`<fn>`) references
  were confirmed (via DOM query) to collect inside `.pagedjs_footnote_area` on the same
  page as their in-text reference — none leaked to an adjacent page.
- **Running head via `@top-center`:** confirmed via
  `getComputedStyle(el, '::after').content` → `"كتاب تجريبي — سبايك رقم واحد"` on page 2,
  and correctly suppressed (`content: none`) on page 1 via `@page :first`, matching the
  Ithraa template's own "no header on the title page" convention (dotx-inventory.md §5).
- **Page numbers via `counter(page)`:** confirmed rendering "1" on page 1 (visually, in a
  white-background screenshot) and the underlying CSS resolves the same rule on every
  subsequent page.
- **Arabic-Indic footnote markers:** confirmed both visually and in the DOM — inline
  references render as `(١)`, `(٢)`, `(٣)` … and the footnote-area list matches, using a
  `@counter-style arabic-indic-parens` counter style.
- No console errors at any point.

### Two real bugs found and fixed in the spike (useful for Workstream C)

1. **`::footnote-marker`/`::footnote-call` collapse silently if split across
   `::before`/`::after` sub-rules.** Paged.js translates these GCPM pseudo-elements into
   real rules like `[data-footnote-call]::after { content: ... }`. Writing
   `::footnote-call { content: counter(...) }` plus a separate
   `::footnote-call::before { content: "(" }` gets flattened onto the *same* generated
   `::after` rule, and only the **last** rule in source order wins — the counter digit
   silently vanished, leaving only the closing paren. **Fix:** always write footnote
   marker content as a single declaration:
   `content: "(" counter(footnote, arabic-indic-parens) ")";`. This is now documented
   inline in the spike file's CSS comments.
2. **Natural content-overflow pagination is slow/unreliable; forced page breaks are
   fast and reliable.** See "Performance/reliability risk" below — the practical fix
   used in the spike is `break-before: page` on section-opening headings (`h2.kitab`),
   which is also just good book design (each "كتاب" starts a fresh page).

### Performance / reliability risk — the most important finding

This is worth flagging to the plan directly. In repeated tests:

- Content that **fits on one page** (no reflow needed) rendered in ~10-20s consistently.
- Content sized to require Paged.js to **detect overflow and create a second page
  naturally** was tested at two sizes (~7.7KB and ~18.7KB of plain justified Arabic
  paragraphs, no footnotes) and in both cases **did not finish within 60-130+ seconds**
  (test was eventually abandoned, not confirmed to ever complete) — `.pagedjs_page`
  count stayed at 0 the entire time, with no console errors, i.e. it was still "working"
  the whole time, just extremely slow or hung.
- Adding an **explicit `break-before: page`** (rather than relying on overflow
  detection) on the actual spike-1 document made a real 2-page, footnote-bearing,
  running-head-bearing document render in ~10s, reliably.
- Re-running the *exact same* forced-break document a second time took ~10s once and
  ~70s another time — so even the "fast path" has meaningful variance in this
  environment.

**Implication for the plan:** do not rely on Paged.js's automatic overflow-based
pagination for long-form content without validating performance on realistic
chapter-length documents (a real fiqh chapter is easily 10-50x the size of what hung
here). The book-layout engine (Workstream C) should very likely insert explicit page
breaks at structural boundaries (kitab/bab starts, or a paginated-chunking strategy
that feeds Paged.js smaller documents rather than one giant HTML tree) rather than
leaning on pure overflow detection for a full book. This should be re-tested outside
this sandboxed browser-automation harness (a real desktop browser may perform very
differently) before treating it as a hard blocker — but budget real engineering time
for it, and spike it again specifically for a full-chapter-length document early in P1.

---

## Spike 2 — Honorific glyph rendering across font stacks

**File:** `spikes/p0/honorifics/index.html`
**Question:** which honorific codepoints render correctly, in which fonts, without
shipping a proprietary font?

### Verdict: **PARTIAL** — good news on this Mac, but the test methodology cannot prove font-specific coverage, and Windows/Android are unverified

### Font file search (as instructed)

Searched recursively for `.ttf`/`.otf` under
`/Users/thiernodiallo/Downloads/ithraa_template/` and the unzipped `.dotx` scratchpad
tree (`scratchpad/dotx/word/...`). **No font files exist in either location** — not
even obfuscated `.odttf`; there is no `word/fonts/` directory at all. This matches
dotx-inventory.md §3's finding that neither `.dotx` embeds any font parts. So no
`@font-face` for "KFGQPC Arabic Symbols 01" could be loaded; that column falls back to
whatever the browser/OS substitutes.

### What the automated matrix reported

All 21 codepoints (U+FDFA, U+FDFB, U+FDFD, U+FD3E, U+FD3F, U+FD40–U+FD4F) came back
**SUPPORTED** in **every** column (system serif, "Geeza Pro", "Scheherazade New",
Amiri via Google Fonts, and even "KFGQPC Arabic Symbols 01" with no font loaded).

### Why that result needs a big caveat

That result is **real** (confirmed visually in a white-background screenshot — every
cell shows a proper calligraphic ligature, not a tofu box) but it does **not** mean
what it looks like it means. On this macOS test browser, the OS transparently
substitutes glyphs from whatever Arabic-capable system font *is* installed whenever the
requested `font-family` lacks the glyph (standard CSS font-fallback behavior) — so
"KFGQPC Arabic Symbols 01" (not installed, no file loaded) rendered identically to
"Amiri" (which *did* load from Google Fonts — confirmed via
`document.fonts` → `{family: "Amiri", status: "loaded"}`). The canvas-measureText
tofu-detection heuristic in the page's own script has the identical blind spot for the
identical reason (canvas rendering goes through the same OS font-fallback path). This
methodology limitation is now documented directly on the spike page itself.

**What we can actually claim:** on **this Mac**, the Unicode-14 Arabic honorific block
(U+FD40–FD4F) plus the two Qur'anic ornate brackets and the three FDFA/FDFB/FDFD
ligatures already render correctly with **zero custom fonts shipped**, via macOS's own
Arabic font fallback — good news if true generally on Apple platforms.

**What we cannot claim:** whether Windows or Android behave the same. Historically,
Windows' bundled Arabic fonts have weaker coverage of newer Unicode blocks, and this
spike has no way to reach a Windows/Android renderer. **This needs a human to open
`spikes/p0/honorifics/index.html` on a Windows machine and an Android phone** and read
off the same SUPPORTED/TOFU table (the in-page heuristic will have the same
fallback-masking limitation there, so also eyeball the rendered glyphs directly, not
just the auto-labeled status).

### Recommendation for the plan

1. Treat "ship nothing, rely on system fallback" as the working default for macOS, but
   **do not** treat this spike as proof it's safe to skip a bundled font entirely —
   get a Windows/Android data point before deciding.
2. If gaps are found on Windows/Android, Amiri (Google Fonts, confirmed loadable, free
   license) is the most promising fallback to test first for the FDFA/FDFB/FDFD trio;
   coverage of the newer FD40–FD4F block specifically should be checked per-font using
   a font-inspection tool (e.g. `opentype.js` parsing the font's `cmap` table) rather
   than browser rendering, since browser rendering cannot isolate per-font coverage
   from OS-level fallback, as this spike demonstrated.
3. Per-glyph SVG fallback (already planned in PLAN.md §2) remains the safe fallback
   for whatever gaps are found.

---

## Spike 3 — Alt-key capture in the browser (macOS)

**File:** `spikes/p0/altkeys/index.html`
**Question:** can a web app reliably capture Ithraa's Alt shortcuts (Alt+X/Z/Q/W/M/0/9/K/L)?

### Verdict: **PARTIAL / INCONCLUSIVE by automation** — manual hardware testing is required, exactly as PLAN.md §5 already anticipated

### What automation showed

All 9 target combos were sent via the browser-automation `key` action (e.g. `alt+x`)
to a focused `contenteditable` box with a capturing `keydown` listener. Full log for
all 9 combos:

| combo sent | `event.key` | `event.code` | `event.altKey` | matched `KeyX`-style target? | `preventDefault()` called? | stray char leaked? |
|---|---|---|---|---|---|---|
| alt+x … alt+l (all 9) | correct lowercase letter/digit (`x`,`z`,`q`,`w`,`m`,`0`,`9`,`k`,`l`) | **empty string `""`** for all 9 | `true` for all 9 | **no** (code was empty, so the plan's `event.code === "KeyX"` style match never fires) | no (didn't fire, since match failed) | **no** — editable text was byte-identical before/after every combo |

Two separate things were learned, and they point in different directions:

1. **`event.code` came through empty for every synthetic combo in this harness.** This
   specifically breaks the plan's recommended matching strategy
   ("intercept via `event.code`-based matching so macOS Option works" — PLAN.md §5).
   This is very likely a **limitation of the CDP-based synthetic key dispatch used by
   this automation tool**, not proof that real browsers fail to populate `event.code`
   for physical Option-key presses (real hardware key events reliably populate `code`
   as `"KeyX"` etc. in Chrome/Safari/Firefox — this is extremely well-established
   platform behavior, unrelated to Option-key composition). It should **not** be read
   as "code-based matching doesn't work" — it should be read as "this specific
   automated-testing path can't validate code-based matching; a human must."
2. **No composed/leaked character appeared for any combo**, but this is weak evidence:
   the synthetic CDP key dispatch used here does not appear to route through the real
   macOS Option-key/IME composition pipeline at all (a plain, non-alt `key` action for
   the letter "a" inserted "a" completely normally with no composition step either), so
   the absence of a leaked "≈"/"Ω"/"œ" character here does not prove `preventDefault()`
   would stop the *real* composed character a physical Option-key press produces. It
   only proves the synthetic path itself doesn't leak — which was expected going in and
   is explicitly called out as a limitation on the spike page itself.

Separately, the generic `type` action (used for typing plain text, not key combos) was
confirmed to bypass `keydown`/`keyup`/`keypress` entirely — it only fires
`beforeinput`/`input`. That's expected/by-design for that tool and not a concern for
this feature (real shortcut handling always goes through `keydown`), but it's worth
knowing if anyone else tries to test typed text this way.

### What this means for the plan

- The event-flow shape (`altKey: true`, correct `key`) is confirmed reachable and
  loggable — a keymap service listening on `keydown` will see these events fire.
- The one thing that actually matters for this feature — **does a physical macOS
  Option+X keypress get intercepted by `event.code` before the OS composes "≈" into
  the field, and does `preventDefault()` stop that composition** — **could not be
  tested by this automation** and remains unverified. This was flagged as a known risk
  before the spike even started (STATUS.md note, PLAN.md §5) and that risk stands.
- **The spike page is built to be tested by a human.** Serve `spikes/p0/altkeys/` and
  open `index.html`, click into the box, and physically press Option+X, Option+Z,
  Option+Q, Option+W, Option+M, Option+0, Option+9, Option+K, Option+L on a real Mac
  keyboard (in Chrome and Safari, ideally both). Read the on-page log table: it shows
  `code`, `key`, `altKey`, whether the combo matched, whether `preventDefault` fired,
  and — critically — whether a composed character leaked into the box. That manual
  pass is the actual go/no-go signal PLAN.md needs; this spike only proves the page
  itself is wired correctly and ready for that manual pass.

### Recommendation

Do the manual test above before committing to `event.code`-based matching as the
default keymap strategy. If a real Option-key press does leak a composed character
despite `preventDefault()` (a known gray area — some browsers apply IME composition
before dispatching `keydown` in a way `preventDefault` can't stop), the fallback is
what PLAN.md already specifies: every shortcut is also reachable via the slash menu/
toolbar, so shortcuts remain an accelerator, never a hard requirement.

---

## Summary

| # | Spike | Verdict | One-line result |
|---|---|---|---|
| 1 | Paged.js RTL + footnotes | PARTIAL | Footnotes/running-heads/page-numbers all work once you avoid two CSS gotchas (documented + fixed in spike), but natural multi-page overflow pagination was unreliably slow in this environment — use forced page breaks at structural boundaries and re-test perf on chapter-length docs. |
| 2 | Honorific glyph coverage | PARTIAL | All 21 codepoints render correctly on macOS via system font fallback with zero custom fonts — but the test can't isolate per-font coverage from OS fallback, so Windows/Android are still unverified; get a human data point there before deciding on a bundled font. |
| 3 | Alt-key capture | PARTIAL / needs manual test | Event flow (`altKey`, `key`) is confirmed reachable; `event.code` and real Option-key composition could not be validated by automation — page is ready, a human must physically press the 9 combos on a real Mac keyboard and read the log table. |
