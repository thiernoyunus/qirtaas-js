# Qirtaas-js repo analysis (from Codex/GPT-5.6 subagent)

## 1. What it does
Qirtaas is an embeddable browser rich-text editor and read-only viewer for Islamic scholarly writing. Accepts TipTap JSON or a document ID; supports rich text plus Qur'an verses, hadith, mushaf clips, honorifics, images, tables; saves TipTap JSON to a compatible web service. Output is live browser content — not a paginated book or file (README.md:1-6,23-44; packages/core/src/mount/types.ts:25-66; packages/core/src/services/documents.ts:9-18,36-52).

## 2. Packages / API
- Root: npm workspaces `packages/*`; build order core → vue → react; Node ^20.19 || >=22.12 (package.json:2-14).
- `@qirtaas/core`: framework-neutral mount API (ESM/UMD/types/CSS).
  - `createQirtaasClient({apiUrl?, getToken?})` — default `https://api.qirtaas.io` (packages/core/src/client.ts:26-39,69-81).
  - `mountEditor(el, options)` — docId or initial JSON, en|ar, light|dark, readonly/autofocus/autosave, callbacks (mount/types.ts:18-50).
  - Editor handle: getJSON, save, setEditable, setTheme, destroy (mount/types.ts:52-67).
  - `mountRenderer(el, options)` — needs signature callback, token callback, or share token (mount/types.ts:69-91; mount/renderer.ts:43-55).
  - Doc ops: listDocuments, deleteDocument, duplicateDocument, getShareInfo, setSharing (client.ts:41-67).
- `@qirtaas/vue`: QirtaasEditor/QirtaasRenderer components; Vue+PrimeVue are host deps.
- `@qirtaas/react`: same components; internal Vue editor is bundled (packages/react/vite.config.ts:6-9,25-41).

## 3. Rendering pipeline
Input JSON → TipTap/ProseMirror in DocumentEditor.vue:204-281 → Vue mounts EditorContent → changes emit editor.getJSON(), autosave POST/PATCH (EmbedEditorApp.vue:98-117,171-182; services/documents.ts:36-52) → renderer fetches same JSON read-only (mount/renderer.ts:71-92).
Custom nodes: span[data-type=quran-verse], figure[data-type=quran-mushaf], span[data-type=honorific] (extensions/QuranVerse.ts:95-107; QuranMushaf.ts:126-160; Honorific.ts:56-81). No public getHTML — JSON only.
Mushaf selector downloads SVG pages, inserts PNG clips (quran/MushafPage.vue:37-75,107-114; services/quran.ts:127-147). Images: PNG/JPEG/WebP.
**No PDF, Canvas, Markdown, DOCX, EPUB, print, or export pipeline exists.**

## 4. Arabic/RTL, fonts, ligatures
- Per-node direction (headings, paragraphs, list items); alignment on headings/paragraphs (DocumentEditor.vue:216-256).
- Qur'an/hadith hardcoded dir="rtl". No whole-editor direction switch by language.
- Fonts: Uthmanic Hafs for QPC Hafs; fallback Geeza Pro → Scheherazade New → serif (styles/embed.css:26-39).
- liga/calt/rlig re-enabled ONLY for Qur'an font classes (ProseMirror disables ligatures otherwise) (DocumentEditor.vue:610-618).
- U+FDFA ﷺ and U+FDFB ﷻ are atomic honorific nodes via shortcuts `:saw:`, `:saws:`, `:صلع:`, `:صلى:` (extensions/Honorific.ts:6-113; HonorificView.vue:5-20). No missing-font fallback.

## 5. Theming/layout
- Public theme control is ONLY light|dark (mount/types.ts:4-5).
- CSS vars for fonts/brand/backgrounds/text/borders/hadith/shadows (embed.css:35-54); PrimeVue burgundy Aura preset (primevuePreset.ts:15-47).
- Tailwind scoped to `.qirtaas-scope`.
- Fixed prose CSS for H1–H3, lists, quotes, tables (DocumentEditor.vue:604-608,637-664,699-795).
- Registered nodes: rich text, direction, emoji, alignment, highlight, underline, links, tables, collapsible details, Quran verse/mushaf, hadith, honorifics, images, search/replace, slash commands (DocumentEditor.vue:216-281).
- NOT present: footnotes, ornaments, page templates, pagination, headers/footers, print layouts.

## 6. Extension points
- New content block = TipTap node pattern (attrs + HTML + Vue view), e.g. extensions/HadithNode.ts:5-40, ImageNode.ts:8-33 — must be registered directly inside DocumentEditor.vue (no plugin registry); toolbar/slash-menu need direct edits (EditorToolbar.vue:12-19; SlashCommand.ts:18-49).
- Consumers cannot pass custom TipTap extensions via public mount options.
- New themes/page designs require CSS edits or new public settings.
- The actual web app + backend live in a separate private monorepo (CONTRIBUTING.md:6-14,25-36).

## 7. Stack / run
npm workspaces, TS, Vue 3, TipTap/ProseMirror, PrimeVue/Aura, Tailwind, Vite, Axios, DOMPurify, Moveable, vue-i18n. `npm install && npm run build`. No demo app documented. Requires backend implementing document/image routes; Quran/hadith/mushaf from hosted content service.
