# Ithraa AlMotoon (إثراء المتون) Template — Full Inventory

Sources inspected:
- `/Users/thiernodiallo/Downloads/ithraa_template_v3.dotx` (3.48 MB, "ن3" = version 3, modified 2021-08-19, unzipped to `scratchpad/dotx/`)
- `/Users/thiernodiallo/Downloads/ithraa_template/ithraa_template/قالب إثراء المتون للباحثين.dotx` (163 KB, older/earlier version, created 2017-03-16, unzipped to `scratchpad/dotx_old/`)
- `/Users/thiernodiallo/Downloads/ithraa_template/ithraa_template/دليل قالب إثراء المتون للباحثين.docx` (56 KB, human-readable Arabic user guide, unzipped to `scratchpad/guide_docx/`)

Both `.dotx` files are genuine Word templates (ZIP/OOXML), **no VBA/macros** — no `word/vbaProject.bin` part exists in either archive, and `[Content_Types].xml` declares no `vnd.ms-word.macroEnabled` types. All "shortcut" behavior is implemented via native Word features: **Building Blocks/AutoText** (`word/glossary/document.xml`) triggered by `F3`, and **keyboard-shortcut→AutoText bindings** stored in `word/customizations.xml` (the `wne:tcg` "toolbar customization" part, which *is* legal inside a plain `.dotx`).

Author: Abdullah AlShetwi (dc:creator); last modified by عبدالرحمن السماري.

---

## 1. Keyboard shortcut → AutoText mapping (decoded from `word/customizations.xml`)

`wne:kcmPrimary` is a 4-hex-digit code = **[2-digit modifier][2-digit Win32 virtual-key code]**. Modifier `04` = Alt. The low byte matches the ASCII/VK code of the letter (VK codes for letters/digits are numerically identical to ASCII: `Q=0x51, W=0x57, X=0x58, Z=0x5A, K=0x4B, L=0x4C, M=0x4D, '0'=0x30, '9'=0x39`). Each `wne:acd` argument is a Base64-encoded UTF-16LE string naming the target AutoText/glossary entry (some are XOR'd/offset — see note below on acd0/acd1).

Decoded table (v3 template):

| kcmPrimary | Shortcut | acd target (decoded) | Building block name | Function |
|---|---|---|---|---|
| 0458 (+0958 alt-layout dup) | **Alt+X** | acd0 | `حاشية بقوسين` | Insert footnote reference, cursor placed between `(` `)` |
| 045A | **Alt+Z** | acd8 | `حاشية بمعقوفتين` | Insert footnote reference, cursor placed between `[` `]` (undocumented in the user guide, but present) |
| 0451 | **Alt+Q** | acd4 | `بيت شعر1` | Insert 3-column poetry table (single row) |
| 0457 | **Alt+W** | acd5 | `بيت شعر2` | Insert 2-row **interleaved** poetry table (columns swap sides row-to-row) |
| 0430 | **Alt+0** | acd2 | (Symbol-command entry, not glossary) `«` in font "Traditional Arabic" | Ornate opening bracket |
| 0439 | **Alt+9** | acd3 | (Symbol-command entry) `»` in font "Traditional Arabic" | Ornate closing bracket |
| 044B | **Alt+K** | acd6 | `العنوان الجانبي1` | Insert margin heading textbox (right-margin variant) |
| 044C | **Alt+L** | acd7 | `العنوان الجانبي2` | Insert margin heading textbox (left-margin variant) |
| 044D | **Alt+M** | acd9 | `نهاية المبحث` | Insert chapter/topic-end ornament symbols |
| 09BE | (non-standard VK 0xBE = OEM_PERIOD; likely an alternate-keyboard-layout registration) | acd1 | `جدول قصيدة` | Legacy "poem table" building block (see version note below) |

**Version note on Alt+Q/Alt+W:** The **older** 2017 template (`dotx_old`) has only 2 shortcuts registered: `0451→Alt+Q` bound directly to `جدول قصيدة` (the single 3-column poem table), and `0458→Alt+X` bound to `حاشية بقوسين`. In the **v3** template, the developer kept `جدول قصيدة` in the glossary but re-pointed **Alt+Q** to a new, differently-shaped block `بيت شعر1`, added **Alt+W → بيت شعر2** (the interleaved 2-row layout), and moved `جدول قصيدة` to the odd `09BE` code (effectively orphaned/inaccessible via a normal Alt-shortcut on a standard layout — likely a leftover from copy-pasting the customization data between template revisions). **For replication, treat Alt+Q = 3-col single-row poem table and Alt+W = 2-row interleaved poem table as authoritative for v3.**

Also documented via prose in the guide (not F3/Alt-bound, but typed-text triggers using Word's "AutoText name → Enter" pattern instead of a keystroke):
- Type **`صفحة`** then `Enter` → inserts the title-page building block (`صفحة العنوان`).
- Type **`عناصر`** then `Enter` → inserts the "fiqh-issue study elements" outline block (`عناصر`).

---

## 2. AutoText / Building Blocks (`word/glossary/document.xml`, gallery = `autoTxt`), triggered by typing the abbreviation then **F3**

### 2a. Honorific ligature symbols (documented in the guide's own comparison table)

All of these insert a **private-use-area glyph** via `<w:sym w:font="KFGQPC Arabic Symbols 01" w:char="U+F0xx"/>` — i.e. the "character" only exists as a custom mapping inside that specific font's glyph table. **These cannot be reproduced with plain Unicode** unless the font "KFGQPC Arabic Symbols 01" (or an equivalent font remapped to the same PUA code points) is embedded/loaded in the web app, because U+F062–U+F075 are Private Use Area code points with no standard meaning outside this font.

| Type abbreviation | Phrase inserted | Font | PUA code point |
|---|---|---|---|
| `عز` | عز وجل | KFGQPC Arabic Symbols 01 | U+F062 |
| `سبح` | سبحانه وتعالى | KFGQPC Arabic Symbols 01 | U+F063 |
| `جل` | جل وعلا | KFGQPC Arabic Symbols 01 | U+F065 |
| `ص1` | صلى الله عليه وسلم | KFGQPC Arabic Symbols 01 | U+F067 |
| `ر1` | رضي الله عنه | KFGQPC Arabic Symbols 01 | U+F068 |
| `ر11` | رضي الله عنها | KFGQPC Arabic Symbols 01 | U+F069 |
| `ر3` | رضي الله عنهم | KFGQPC Arabic Symbols 01 | U+F06A |
| `ر2` | رضي الله عنهما | KFGQPC Arabic Symbols 01 | U+F06B |
| `ر33` | رضي الله عنهن | KFGQPC Arabic Symbols 01 | U+F06C |
| `ع1` | عليه السلام | KFGQPC Arabic Symbols 01 | U+F06E |
| `ع11` | عليها السلام | KFGQPC Arabic Symbols 01 | U+F06F |
| `ع3` | عليهم السلام | KFGQPC Arabic Symbols 01 | U+F070 |
| `ع2` | عليهما السلام | KFGQPC Arabic Symbols 01 | U+F071 |
| `رح1` | رحمه الله | KFGQPC Arabic Symbols 01 | U+F072 |
| `رح3` | رحمهم الله | KFGQPC Arabic Symbols 01 | U+F073 |
| `رح2` | رحمهما الله | KFGQPC Arabic Symbols 01 | U+F074 |
| `رح11` | رحمها الله | KFGQPC Arabic Symbols 01 | U+F075 |

### 2b. Additional AutoText only found in the v3 glossary (not in the printed guide table)

| Type abbreviation | Inserts | Encoding |
|---|---|---|
| `ص2` | ﷺ | **Plain Unicode U+FDFA** (ARABIC LIGATURE SALLALLAHOU ALAYHE WASALLAM) — a genuine standard-Unicode alternative to `ص1`'s font-locked glyph. **This one *is* fully replicable with plain Unicode/web fonts.** |
| `بسم1` | (bismillah ligature) | SYM font=KFGQPC Arabic Symbols 01, char=U+F021 |
| `بسم2` | (bismillah ligature variant) | SYM font=KFGQPC Arabic Symbols 01, char=U+F022 |
| `بسم3` | (bismillah ligature variant) | SYM font=KFGQPC Arabic Symbols 01, char=U+F023 |

### 2c. Structural / template blocks (typed name + Enter, or via ribbon "Quick Parts")

| Name | Style | Content |
|---|---|---|
| `حاشية بقوسين` | Normal | `(` `)` — Alt+X target |
| `حاشية بمعقوفتين` | Normal | `[` `]` — Alt+Z target |
| `جدول قصيدة` | قصيدة | 3-col poem table, no visible shortcut in v3 (see §1) |
| `بيت شعر1` | قصيدة | 3-col poem table (Alt+Q target) |
| `بيت شعر2` | قصيدة | 2-row interleaved poem table (Alt+W target) |
| `العنوان الجانبي1` / `العنوان الجانبي2` | Normal | Floating margin-heading textboxes (Alt+K / Alt+L targets) |
| `نهاية المبحث` | رموز النهاية | Chapter/topic-end ornament run (Alt+M target) — see §2d |
| `صفحة العنوان` | كليشة | KSU/Imam-university-style title page table (typed `صفحة`+Enter) |
| `عناصر` | Normal | Fiqh-issue-analysis outline text (typed `عناصر`+Enter) — see §6 |
| `واجهة الإسلامية`, `واجهة سعود`, `واجهة الإمام`, `واجهة أم القرى`, `واجهة خالد`, `واجهة القصيم`, `واجهة الجوف` | كليشة | 7 alternate university title-page templates (Islamic Univ. of Madinah, King Saud Univ., Imam Muhammad ibn Saud Univ., Umm Al-Qura Univ., King Khalid Univ., Qassim Univ., Al-Jouf Univ.) — pure placeholder text tables, no font/symbol dependency |
| `C4D6BFE1785643EBA9672ED347CAB80B`, `6330CF155241400CA15F298DE1C1180A` | placeholder gallery | Both insert the literal placeholder phrase "يُذكر هنا القول موجزًا/موجزاً" (used inside the `عناصر` block as a repeatable "content control" style placeholder) |

### 2d. `نهاية المبحث` (Alt+M) — chapter/topic-end ornament

Six consecutive symbol runs, all in font **"AGA Arabesque"** (a decorative/dingbat font, distinct from KFGQPC):
`U+F05F, U+F05F, U+F060, U+F060, U+F05F, U+F05F` (paragraph style `رموز النهاية`, centered, base font Sakkal Majalla 17pt/18pt for style default but overridden per-run by the `w:sym` font). **Not reproducible with plain Unicode** — AGA Arabesque is a symbol/dingbat font with its own PUA glyph set; would need the actual font file or a hand-drawn SVG ornament substitute.

---

## 3. Fonts

`word/fontTable.xml` (main document, i.e. fonts a *regular* document author could type in): Times New Roman, Calibri, Arial, **Sakkal Majalla**, **Traditional Arabic**, Calibri Light, **PT Bold Heading**, AAA GoldenLotus, Tahoma.

`word/glossary/fontTable.xml` (glossary/Building-Blocks part) additionally lists two fonts **not** in the main document's font table, because they're only referenced through `<w:sym>` elements rather than normal text runs:
- **KFGQPC Arabic Symbols 01** — custom PUA symbol font (King Fahd Glorious Quran Printing Complex family); required for all `ص1/ر*/ع*/رح*/عز/سبح/جل/بسم*` ligatures.
- **AGA Arabesque** — decorative dingbat font; required for the `نهاية المبحث` (Alt+M) ornament.

The guide document itself explicitly warns: *"إذا لم تظهر لك الرموز في الجدول، فقم بتثبيت خط المدرجات من هنا"* ("If the symbols don't display in the table, install the **Madarij** font from here [link, not captured in the static XML]") — confirming these are optional/companion font installs, not bundled inside the `.dotx`. **No font files are embedded in either archive** (no `fontdata` parts, no `w:embedRegular`/`embedSystem` refs found) — the fonts must be separately installed on the researcher's machine.

Body/default styles use **Sakkal Majalla** (body text) and **Traditional Arabic** (footnotes, complex-script fallback); headings use theme font **"PT Bold Heading"** for `heading 1`/`Title`.

---

## 4. Macros / VBA

- `ithraa_template_v3.dotx` and the older `.dotx`: both are plain OOXML templates. **No `word/vbaProject.bin`**, no macro-enabled content type declared. **No macros exist in either file.**
- Keyboard-shortcut customization lives entirely in `word/customizations.xml` (`wne:tcg` schema — Word's native "toolbar/keyboard customization" XML, unrelated to VBA). Decoded in §1.
- No companion `.dotm` was found anywhere on disk (only the two `.dotx` and the `.docx` guide were present in the supplied folders).

---

## 5. Page setup (`word/document.xml` → `w:sectPr`)

```xml
<w:pgSz w:w="11906" w:h="16838" w:code="9"/>                 <!-- A4, code 9 = A4 -->
<w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="680" w:footer="0" w:gutter="0"/>
<w:cols w:space="708"/>                                       <!-- single column -->
<w:titlePg/>                                                  <!-- first page has distinct (blank) header/footer -->
<w:bidi/><w:rtlGutter/>                                       <!-- RTL section direction + RTL gutter -->
```
- Page size: A4 (210×297mm / 11906×16838 twips).
- Margins: 1418 twips ≈ **2.5 cm** on all four sides; header distance 680 twips ≈ 1.2 cm; footer distance 0 (footer sits at page-margin edge); no gutter.
- `w:titlePg` confirms the guide's own tip: *"الصفحة الأولى من القالب بلا ترويسة"* ("the template's first page has no header, since it's usually the research title page") — first-page header/footer parts exist but are effectively blank/suppressed.
- Header (`word/header1.xml`) contains a page-number field and the literal placeholder text "عنوان البحث" (research title). Footer (`word/footer1.xml`) is empty.
- **Footnote separator** (`word/footnotes.xml`): both `type="separator"` and `type="continuationSeparator"` use Word's plain default `<w:separator/>`/no custom rule graphic — i.e. standard short horizontal line, no custom styling.
- `settings.xml`: `defaultTabStop=720` twips (0.5in), `themeFontLang` en-US / bidi ar-SA, single-line footnote numbering restart at document scope (no custom per-section restart found).
- No multi-column layout is configured anywhere in the base document (`w:cols w:space="708"` with no `w:num` attribute = single column); the "two/three-column" structures the task asks about (poetry tables) are implemented as actual Word **tables**, not section columns.

---

## 6. Numbering / lists (`word/numbering.xml`)

Only **3 simple `abstractNum` definitions** exist, all `hybridMultilevel` with a plain top-level **decimal** format:
- abstractNumId 0 → lvlText `%1-` (e.g. "1-", "2-")
- abstractNumId 1 & 2 → lvlText `%1)` (e.g. "1)", "2)")

Mapped via `w:num`: numId 1→abstractNum 2, numId 2→abstractNum 1, numId 3→abstractNum 0.

**Important finding:** the `عناصر` (fiqh-issue study elements) AutoText block is **not** an actual numbered list — inspecting its content shows plain static text with manually-typed labels (`صورة المسألة:`, `تحرير محل النزاع:`, `الأقوال في المسألة:`, `القول الأول:`, `القول الثاني:`, `الأدلة:`, `أدلة القول الأول:`, `الدليل الأول:`, `نوقش:`, `الدليل الثاني:`, `نوقش:`, `أدلة القول الثاني:` …) — headings and structure are hard-coded text runs, not Word list/numbering fields. This is good news for replication: no numbering-engine emulation is needed for this feature, just a static outline template (arguably with the two placeholder blocks in §2c standing in for "click and type your summarized view here").

---

## 7. Poetry table structures (`word/glossary/document.xml`)

All three poem-related building blocks share: `bidiVisual` table direction, no borders (`w:tblBorders` all `none`), centered (`w:jc=center`), fixed row height 567 twips (~1 cm), cell paragraph style `a7` = "footnote text" (font Traditional Arabic, 12pt/14pt-cs).

**`جدول قصيدة`** (legacy, orphaned shortcut in v3 — see §1) and **`بيت شعر1`** (current Alt+Q target): identical concept — **1 row × 3 columns**, roughly 6cm / 2cm / 6cm (first hemistich | gap | second hemistich). `بيت شعر1`'s outer cells additionally seed a manual line break (`<w:br/>`) inside each cell (`جدول قصيدة` does not).

**`بيت شعر2`** (Alt+W target) — the "interleaved" layout: **2 rows × 3 grid-columns**, where columns 1–2 are merged (`gridSpan=2`, 4536 twips ≈ 8cm) alternating sides between rows:
- Row 1: `[merged 2-col cell (8cm)] [single cell (3cm)]`
- Row 2: `[single cell (3cm)] [merged 2-col cell (8cm)]`

This produces the classic Arabic poetry-citation zig-zag: first hemistich spans wide on the right in row 1, second hemistich spans wide on the left in row 2 (or vice versa depending on RTL rendering), each with a small offset column on the opposite side — matching the task's "interleaved two-row" description.

Per the printed guide: after Alt+Q, type the first hemistich, `Shift+Enter`, then `Tab` moves to the next column or creates a new row.

---

## 8. What CANNOT be replicated with plain Unicode (font-dependent glyphs)

1. **All `KFGQPC Arabic Symbols 01` PUA glyphs** (U+F021–U+F075: بسم1/2/3, ص1, ر1/ر11/ر2/ر3/ر33, ع1/ع11/ع2/ع3, رح1/رح2/رح3/رح11, عز, سبح, جل) — these code points have no meaning without that exact font (or a re-mapped substitute font using the same PUA slots). A web replica needs either: (a) the actual font file embedded via `@font-face` and served to end users, or (b) a mapping table swapping each abbreviation to a real Unicode ligature/plain-text equivalent (e.g. `ص1` → literal "صلى الله عليه وسلم" or the standard ligature U+FDFA, as the template's own `ص2` entry already does).
2. **`نهاية المبحث` (Alt+M) ornament** — 6 glyphs from the **AGA Arabesque** dingbat font (U+F05F/U+F060 PUA slots). No standard Unicode equivalent exists; would need an SVG/icon substitute or the actual font embedded.
3. **Ornate brackets on Alt+0/Alt+9** — implemented as U+00AB/U+00BB (`«`/`»`) forced into font "Traditional Arabic" (via a `Symbol`-command AutoCorrect entry, not a glossary block) — behavior depends on Traditional Arabic's specific glyph design for those code points; a web app should instead use the standard Unicode **ornate parentheses U+FD3E `﴾` / U+FD3F `﴿`**, which are purpose-built for this exact use case in Arabic typography and don't require any special font.
4. **Margin headings (Alt+K/L)** — not text/paragraph based at all; each is a **floating, page-anchored text box** (`wp:anchor`, position relative to column ± ~6350–6400 EMU offset, fixed size ~2.2×2.9cm) placed in the outer margin, styled with paragraph style `عنوان جانبي` (Sakkal Majalla, 12pt, bold, centered). Two variants exist purely to mirror the box to the left or right margin (for recto/verso pages). This is a print-layout concept with no direct web equivalent — would need to be reimagined as a sidebar/marginalia UI element rather than ported literally.

---

## Appendix: complete style catalogue (`word/styles.xml`, 37 styles)

| styleId | type | Name | Based on | Font (ascii/cs) | Size (pt, half-pt/2) | Color | Align | RTL/bidi |
|---|---|---|---|---|---|---|---|---|
| a | paragraph | Normal | — | Sakkal Majalla / Traditional Arabic | 17 / 18(cs) | — | lowKashida (justify+kashida) | bidi |
| 1 | paragraph | heading 1 | Normal | theme major / **PT Bold Heading**(cs) | 20(cs) | — | center | — |
| 2 | paragraph | heading 2 | Normal | theme major | 20(cs) | — | — | — |
| 3 | paragraph | heading 3 | Normal | theme major | 12 | — | — | — |
| 4 | paragraph | heading 4 | Normal | theme major | — | — | — | italic |
| 5 | paragraph | heading 5 | Normal | — | — | — | — | — |
| a3 | paragraph | annotation text (comments) | Normal | AAA GoldenLotus(cs) | 10 / 14(cs) | — | left | — |
| a4 | paragraph | header | Normal | — | 14(cs) | — | — | — |
| a5 | paragraph | footer | Normal | — | — | — | — | — |
| a6 | character | footnote reference | — | Traditional Arabic | 16 / 18(cs) | — | — | — |
| a7 | paragraph | footnote text | Normal | Traditional Arabic | 12 / 14(cs) | — | — | — |
| a8 | table | Table Grid | Normal Table | — | — | — | — | — |
| a9 | paragraph | **قصيدة** (poetry) | Normal | inherits Normal | inherits | — | inherits | — |
| aa | paragraph | Title | Normal | theme major / PT Bold Heading(cs) | 28 / 36(cs) | — | center | — |
| ab | paragraph | **كليشة** (cliché/title-page) | — | Sakkal Majalla / Traditional Arabic | 14 / 16(cs) | — | center | — |
| ac | paragraph | صفحة العنوان (title page) | — | Sakkal Majalla / Traditional Arabic | 16 / 18(cs) | — | center | bold |
| ad | paragraph | Balloon Text | Normal | Tahoma | 9 | — | — | — |
| ae | character | Strong | — | — | — | — | — | bold |
| af | character | page number | — | — | — | — | — | — |
| af0 | paragraph | No Spacing | — | — | — | — | — | bidi |
| af1 | paragraph | **عنوان جانبي** (margin heading) | Normal | Sakkal Majalla(cs) | 12 / 12(cs) | — | center | bold |
| af8 (glossary only) | paragraph | **رموز النهاية** (end symbols) | Normal | Sakkal Majalla / Traditional Arabic(cs) | 17 / 18(cs) | — | center | — |

(Character-style `…Char` counterparts for header/footer/footnote/headings/عنوان جانبي/رموز النهاية omitted from the table above for brevity — they mirror their linked paragraph style's font/size.)

Additional styles defined **only inside** `word/glossary/styles.xml`: one auto-generated style per AutoText entry sharing the entry's own name (e.g. style "ص1", style "عز", style "رح1" …), each just a thin wrapper around Normal — these exist because Word auto-creates a style per glossary entry when the entry is first saved via the "Save Selection to Quick Part Gallery" UI flow; they carry no meaningful formatting beyond what's already captured above.
