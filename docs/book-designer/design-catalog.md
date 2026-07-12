# Islamic Book Design Catalog

Source: `/Users/thiernodiallo/Downloads/islamic book design/` — 5 PDFs, no subfolders:
1. `Microsoft Word - نصائح لأهل القرآن (2)_Extracted.pdf` (5 pp) — "NASA" (modern Word-generated)
2. `ajroomiya book.pdf` (12 pp) — المتمع في شرح الآجرومية — B&W classical grammar text
3. `arabaeen.pdf` (16 pp) — شرح الأربعين النووية — color hadith commentary, parchment cover
4. `duroos muhim.pdf` (6 pp) — شرح الدروس المهمة لعامة الأمة — modern gradient cover, aqidah primer
5. `uthaymeen.pdf` (14 pp) — لقاءات وفتاوى الأقليات المسلمة — deluxe "leather" fatwa collection

---

## 1. PAGE FRAMES / BORDERS

- **Triple concentric frame (uthaymeen, ajroomiya covers)**: outermost hairline rule (1px black), ~4-6px gap, then a repeating small ornament band (alternating diamond/star glyphs ⧫ or a toothed zig-zag ▲▼▲▼ ribbon), ~4-6px gap, innermost hairline rule. Renders in CSS as nested `border` divs or a `border-image` using a repeating SVG tile.
- **Double hairline frame, no ornament (ajroomiya interior blank/half-title page)**: two concentric rectangles, ~6-8px apart, both 1-1.5px solid black. Simple `border: 1px solid; padding: 6px; border: 1px solid` nested divs.
- **Vine-scroll ornamental frame (arabaeen cover)**: heavy (~15-20px) decorative border built from a repeating blue acanthus/arabesque tile along each edge, with a distinct larger corner medallion (radial floral burst) where edges meet. Best rebuilt as an SVG `<pattern>` repeated via `stroke` along a rect path, or four corner SVGs + repeating edge SVG strip via CSS `border-image-repeat: round`.
- **Gold-on-black embossed frame (uthaymeen cover)**: same vine-scroll concept but gold (#c9a13b-ish) on near-black (#141414), lower contrast/"embossed leather" look — add a subtle inner `box-shadow: inset 0 0 20px rgba(0,0,0,.6)` and a fine noise/leather texture overlay to fake tooling.
- **No frame, plain white margins**: majority of interior body pages across all 5 books — clean white page, no rule, just generous margins (~15-18% of page width) and the running head as the only graphic element.

## 2. CHAPTER / SECTION OPENING PAGES (unwan-style)

Two competing conventions observed, both worth offering as presets:

- **"Arch/gate" opening (duroos muhim, uthaymeen)**: a horizontal decorative bracket shaped like a shouldered horseshoe arch (⌐‾‾⌐ mirrored, i.e. `⊂⌢⊃`) with a small pillar/column-base icon at each end, drawn in black outline, ~full text-width, centered. Inside the arch: bold red or black display-weight title (lesson/lecture name), often with a Hijri date in small text beneath. Below the arch: an ornamental thin divider — three tiny gear/cog glyphs in a row — separates the arch header from a small centered Bismillah in a fine cursive/thuluth face, before body text starts. Generous whitespace above and below (roughly 1 line-height each). CSS: an SVG arch shape (viewBox ~600×80) as a background/border element with title text absolutely centered inside it.
- **Plain rubric heading (arabaeen)**: no ornament at all — just a centered, bold, colored (magenta/pink) heading line, one blank line above and below, then body text starts immediately in black. Minimalist, relies purely on color + weight + centering for hierarchy, no whitespace beyond a single blank line.
- **Full illustrated title page (all 5 covers)**: reserved for the book's main title only, not repeated per-chapter — large calligraphic display title (thuluth/diwani face) centered in upper-middle third, author name in a smaller naskh/ruqaa line below, publisher/series info near bottom, generous negative space top and bottom.

## 3. HEADING HIERARCHY (كتاب / باب / فصل / مسألة equivalents observed)

| Level in samples | Example | Treatment |
|---|---|---|
| Book/work title (كتاب) | "شرح الأربعين النووية" | Full-width illustrated cover only, huge calligraphic display type |
| Lecture/lesson (الدرس) | "الدرس الأول: تفسير سورة الفاتحة" | Arch-bracket ornament OR centered colored rubric, own page-top position, TOC marked with a filled circle bullet ○ |
| Hadith/numbered unit (الحديث) | "الحَديثُ الثَّالِثُ" | Centered, bold, colored (magenta #b0158e in arabaeen), NOT boxed, generous line-height above; sequential ordinal spelled out in Arabic words, not digits |
| Sub-topic within a lesson | "شهادة: أن محمدًا رسول الله" | Right-aligned (not centered) bold black run-in heading, same size as body but bold, sits inline before its paragraph continues; TOC marked with small square bullet ■/□, indented one level from the ○ bullets |
| Rubric/definition term | "﴿الحَمْدُ لِلَّهِ﴾" or "قال المصنّف:" | Bold, sometimes colored, run into the paragraph rather than on its own line |
| Numbered exercise/mas'ala | "تمارين" + circled digit ① | Circled Arabic-Indic numeral (drawn as a number inside a thin circle) marks each item, heading "تمارين" itself centered bold |

General pattern: **centering + color/weight distinguishes major divisions (chapter, hadith #); right/inline placement + bold-only distinguishes minor divisions (sub-topics, definitions).** No book in the sample used background-color "chips" or boxed headings for text (the box motif was reserved for cover title cartouches and TOC ornament bars).

## 4. END-OF-CHAPTER / END-OF-SECTION ORNAMENTS

- **Four-flower row** (ajroomiya): `❁ ❁ ❁ ❁` (or similar 4-petal asterisk/rosette glyph), centered, black, roughly 1 line-height of vertical space above and below, marks end of a rule/mas'ala block.
- **Triple-asterisk row** (arabaeen): plain `* * *` centered, small size, minimal — marks end of each hadith's commentary before the next hadith heading.
- **TOC-page closer** (arabaeen index): same `❁❁❁` reused at the very end of the table of contents.
- No triangular colophon (end-of-book seal) was present in this sample set — worth designing as an optional preset (a downward-pointing triangular block of centered, progressively shorter lines, common in older lithograph Islamic prints) even though not observed here, since the user's brief calls it out explicitly.

## 5. FOOTNOTE AREA

- Separator: a plain thin horizontal rule (1px black), roughly 30-40% page width, left-aligned at the bottom margin, no ornament.
- Numbering: parenthesized **Western-style sequential digits** in every sample — "(١)" "(٢)" "(٣)" using Eastern Arabic-Indic numerals but Western parenthesis convention, set as a small superscript-like leading marker at the start of each footnote line (not true superscript, just smaller baseline text at line start). In-text reference mark is a matching small parenthesized number placed as a superscript immediately after the referenced word.
- Font size ratio: footnote text is visibly ~65-75% of body size (e.g. body ~14-16pt equivalent, footnote ~10-11pt equivalent), same typeface family as body, single-spaced, tighter leading than body.
- Footnotes reset per page (numbering restarts at (١) on each new page) in the ajroomiya and arabaeen samples.

## 6. POETRY / VERSE LAYOUTS

Not present in this sample set — none of the 5 PDFs contained verse/poetry (شعر) blocks. Recommend building this preset from established convention rather than these scans: two hemistichs (شطر) per line separated by generous horizontal whitespace (often a center gap of 3-6 em, sometimes filled with a short decorative rule or tatweel/kashida stretch), each hemistich right- and left-justified respectively toward the outer margins so the gap floats centered, verse block indented slightly from body margins, no bullet/number unless citing a poem's line count.

## 7. QURAN QUOTATION STYLING

- Ornate Quranic brackets **﴿ ... ﴾** (U+FD3E / U+FD3F, the ornamental parenthesis marks) wrap every Quran quotation in all samples that quote scripture (duroos muhim, ajroomiya exercises, the dedicated "نصائح لأهل القرآن" booklet).
- Text inside the brackets uses **Uthmani Quranic script** (distinct letterforms/ligatures from the surrounding naskh body, visibly denser diacritics), same black ink color as body — no color differentiation was used in this sample set (contrary to some modern app conventions that tint Quran text green/gold). Ayah-end marks are small circular medallions enclosing the Eastern Arabic-Indic verse number, e.g. a small ring around "١" — rebuildable as a small inline SVG circle+number glyph or by using an Uthmani web font that includes ayah-end characters (U+06DD).
- In the comparison-table booklet (نصائح لأهل القرآن), matching/similar ayahs are laid out in a **bordered HTML-table**-like grid: one column "الآيات المتشابهة" (wide, right-aligned, holds the ayah with brackets) and one column "السورة" (narrow, holds the surah name), black-ruled cell borders, header row bold-centered.

## 8. HADITH (MATN) vs COMMENTARY (SHARH) DISTINCTION

- No color separation between matn and sharh was observed — both hadith text and its explanation are set in the same black ink and same body typeface.
- Distinction is made by **structure, not color**: the matn is introduced by the isnad ("عَنْ أَبِي عَبْدِ الرَّحْمَنِ... قَالَ...") flowing directly into the Prophetic saying in quotation-like flow ending with «رَوَاهُ البُخَارِيُّ، وَمُسْلِمٌ» (source citation) also inline, then a blank-line paragraph break before the sharh/commentary begins. Key repeated matn phrases are sometimes **re-quoted in the commentary paragraph in bold** (e.g. "بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ" reappears bolded mid-explanation) — bold-weight is the only differentiator used, no box, no color, no font change.
- Recommendation for the app: offer bold-only as the default (faithful to source), with an optional "colored matn" toggle (e.g. matn in a deep green/maroon, sharh in black) as a modern convenience preset, since it wasn't in these specific scans but is common in other classical layouts.

## 9. PAGE FURNITURE

- **Page numbers**: centered at the very bottom in dash brackets "－٥－" (modern Word doc, نصائح لأهل القرآن), OR set inside a small ornamental oval/lens cartouche with two tiny finial circles flanking the page number, positioned in the *running head* area rather than the footer (ajroomiya: "‹١٣›" self-contained shape at top), OR simple plain digit at top corner opposite the running title (arabaeen, uthaymeen).
- **Running heads**: current chapter/section title on one side of a thin horizontal rule spanning the text width, page number on the other side, rule sits directly under both — present on nearly every interior page across all 5 books. This is the single most consistent furniture element in the whole set.
- **Marginal notes**: none observed in this sample (no marginalia/hawashi visible) — footnotes handle all annotation.
- **Circled/decorative numerals**: exercise numbers in ajroomiya are drawn as Eastern Arabic-Indic digits inside a thin circle outline (①-style), distinct from footnote numbers which use plain parentheses.

## 10. COLOR PALETTES & TYPOGRAPHY

### Estimated hex palettes per book
| Book | Ground | Primary accent | Secondary accent | Notes |
|---|---|---|---|---|
| نصائح لأهل القرآن | #FFFFFF | #000000 | — | Pure B&W, Word-generated, bold sans/naskh hybrid display face for title |
| ajroomiya | #FFFFFF (interior) / cover: indigo #3A2A6D → sky gradient | gold #F0C419 | red #C81F1F | Interior strictly B&W; cover only is color |
| arabaeen | cover parchment #F1E1AE | royal blue #1F4E8C (border) | deep red #A91E22 (title) | Interior: white ground, magenta/pink rubric #B0158E |
| duroos muhim | cover white→teal-gold gradient | teal #1C7A72 | gold/orange #E1A339 | Interior: white ground, red rubric #C21F1F, black body |
| uthaymeen | near-black leather #141414 | gold #C9A13B | maroon #7A1F1F cartouche | Interior strictly B&W |

### Typography classes observed
- **Body/naskh**: dense, fully-justified, moderate x-height, used for 100% of running text in every book — this is the workhorse face (visually consistent with Traditional Arabic / KFGQPC Uthman-adjacent naskh printing faces).
- **Display/thuluth or diwani**: bold, high-contrast stroke, heavy ligatures — used exclusively for main title on covers and for the arch-bracket lecture titles (duroos muhim, uthaymeen). Never used for body text.
- **Uthmani Quran face**: distinct from naskh body wherever ayahs are quoted — denser diacritics, different letterform proportions (e.g. medial ha, final noon shapes differ visibly from the naskh body face around it).
- **Sans/modern hybrid**: only in the Word-generated نصائح booklet — a bold geometric-leaning Arabic display face for the title, otherwise naskh for body. This is the "non-classical" outlier of the set.
- Rubric/heading color is always applied to a **naskh-weight-bold** cut of the body face, not a separate display face — color + bold + centering does the hierarchy work, not a typeface swap (except for the arch-bracket titles, which do swap to a bolder cut).

---

## THEME GROUPINGS (candidate selectable presets for the app)

### Theme A — "Classical Monochrome" (ajroomiya)
- B&W only. Toothed double-frame borders on title pages. Arch/medallion running-head page-number cartouche. Four-flower `❁❁❁❁` section-end ornament. Circled exercise numerals. Tree-diagram boxes for grammar schemas (rounded-rect black boxes, thin connector lines).
- Defining components: monochrome palette, ornamental frame, flower-row divider, oval page-number cartouche.

### Theme B — "Parchment & Indigo" (arabaeen)
- Warm cream/parchment ground with blue arabesque tessellation fill, heavy vine-scroll border with corner medallions on covers only. Interior is plain white with bright magenta/pink rubric headings, black naskh body, triple-asterisk section dividers, footnote rule + parenthesized digits.
- Defining components: parchment+blue-vine cover, magenta rubric color, minimalist plain-heading hierarchy (no box/arch ornament on interior pages), asterisk-row dividers.

### Theme C — "Modern Gradient Primer" (duroos muhim)
- Contemporary gradient cover (teal→gold) with a literal illustration (pen/paper) rather than abstract ornament — most "modern textbook" of the set. Interior uses the arch/pillar-bracket lecture-heading motif, red rubric color, circle/square TOC bullet hierarchy (○ for lesson, ■ for sub-topic).
- Defining components: gradient cover with illustrative icon, red rubric, arch-bracket chapter openers, circle/square TOC bullet system.

### Theme D — "Deluxe Leather & Gold" (uthaymeen)
- Black "leather" cover, gold-embossed vine border, maroon cartouche with gold thuluth title, small Kaaba/mihrab icon column, series-number badge. Interior strictly B&W, same arch/pillar-bracket lecture-heading motif as Theme C (shared convention), oval page-number cartouche in running head, gear-glyph mini-divider under the arch before Bismillah.
- Defining components: black+gold "leather" cover treatment, maroon title cartouche, arch-bracket heading (shared with Theme C), monochrome interior.

### Theme E — "Plain Modern / Word-Doc" (نصائح لأهل القرآن)
- Pure B&W, no ornament anywhere, dash-bracketed page numbers "－٥－", bold geometric display title font (non-classical), bordered comparison tables for Quran ayah study. Closest to a "minimalist" utility preset — good default/fallback theme for users who want zero ornamentation.
- Defining components: no borders/ornaments, dash-number footer, plain ruled tables, bold sans-ish display title.

**Cross-cutting note**: Themes C and D share the identical arch/pillar-bracket chapter-heading component despite very different cover treatments — this strongly suggests the arch-bracket is a reusable, palette-independent component in the taxonomy (its color/weight can be swapped per theme while its shape stays fixed), and should be implemented as one parameterized SVG component in the app rather than baked per-theme.
