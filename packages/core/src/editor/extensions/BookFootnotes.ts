import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { escapeHtml } from "../escapeHtml";
import { placeFootnotes, type MeasuredFootnote } from "../bookFootnoteLayout";

interface BookFootnotesOptions {
  pageHeight: number;
}

interface FootnoteData extends MeasuredFootnote {
  bracketStyle: "parens" | "brackets";
  content: string;
  number: number;
}

const arabicNumber = (number: number) =>
  String(number).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!);

const renderNotes = (notes: FootnoteData[], page: number, editable: boolean) =>
  `<div class="qirtaas-page-footnotes" data-page-number="${page}" dir="rtl">${notes.map((note) => {
    const number = arabicNumber(note.number);
    const marker = note.bracketStyle === "brackets" ? `[${number}]` : `(${number})`;
    const action = editable ? "Edit" : "Go to";
    return `<button type="button" aria-label="${action} footnote ${number}" class="qirtaas-page-footnote" data-footnote-id="${escapeHtml(note.id)}"><span class="qirtaas-page-footnote-marker">${marker}</span> ${escapeHtml(note.content)}</button>`;
  }).join("")}</div>`;

const cssPixels = (element: HTMLElement, property: string, fallback: number) => {
  const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(property));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

/** Live, variable-height page notes for book mode. */
export const BookFootnotes = Extension.create<BookFootnotesOptions>({
  name: "bookFootnotes",

  addOptions() {
    return { pageHeight: 1123 };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            click: (view, event) => {
              const pageNote = event.target instanceof Element
                ? event.target.closest<HTMLElement>(".qirtaas-page-footnote[data-footnote-id]")
                : null;
              if (!pageNote) return false;

              const reference = [...view.dom.querySelectorAll<HTMLElement>(".footnote-ref[data-footnote-id]")]
                .find((element) => element.dataset.footnoteId === pageNote.dataset.footnoteId);
              const marker = reference?.querySelector<HTMLElement>(".footnote-marker");
              if (!reference || !marker) return false;

              event.preventDefault();
              if (marker instanceof HTMLButtonElement && !reference.querySelector(".footnote-popover")) {
                marker.click();
              }
              reference.scrollIntoView({ block: "center" });
              return true;
            },
          },
        },
        view: (view) => {
          let timer = 0;
          let firstFrame = 0;
          let secondFrame = 0;
          let renderedPages = new Set<number>();

          const clearRenderedNotes = () => {
            const pages = [...renderedPages];
            renderedPages = new Set();
            pages.forEach((page) => editor.commands.updateFooterContent("", "", page));
          };

          const measureAndPlace = () => {
            const rootRect = view.dom.getBoundingClientRect();
            const gaps = [...view.dom.querySelectorAll<HTMLElement>("#pages > .rm-page-break .rm-pagination-gap")];
            const gapBottoms = gaps.map((gap) => gap.getBoundingClientRect().bottom);
            const headers = [...view.dom.querySelectorAll<HTMLElement>("#pages > .rm-page-break .rm-page-header")];
            const firstHeader = view.dom.querySelector<HTMLElement>(".rm-first-page-header");
            const rootStyle = getComputedStyle(view.dom);
            const firstCapacity = cssPixels(view.dom, "--rm-page-content-first", this.options.pageHeight * 0.8);
            const generalCapacity = cssPixels(view.dom, "--rm-page-content-general", firstCapacity);
            const capacity = (page: number) => cssPixels(
              view.dom,
              `--rm-page-content-${page}`,
              page === 1 ? firstCapacity : generalCapacity,
            );
            const pageStart = (page: number) => {
              if (page === 1) {
                const visibleFirstHeader = firstHeader && getComputedStyle(firstHeader).display !== "none";
                return visibleFirstHeader
                  ? firstHeader.getBoundingClientRect().bottom
                  : rootRect.top + Number.parseFloat(rootStyle.paddingTop || "0");
              }
              return headers[page - 2]?.getBoundingClientRect().bottom ?? rootRect.top;
            };
            const continuousPageStart = (page: number) => {
              let offset = 0;
              for (let number = 1; number < page; number += 1) offset += capacity(number);
              return offset;
            };

            const measure = document.createElement("div");
            measure.className = "qirtaas-scope qirtaas-page-mode-book qirtaas-footnote-measure";
            measure.dir = "rtl";
            measure.style.fontFamily = rootStyle.fontFamily;
            measure.style.fontSize = rootStyle.fontSize;
            measure.style.fontWeight = rootStyle.fontWeight;
            measure.style.fontStyle = rootStyle.fontStyle;
            measure.style.lineHeight = rootStyle.lineHeight;
            ["--rm-page-width", "--rm-margin-left", "--rm-margin-right"].forEach((property) =>
              measure.style.setProperty(property, rootStyle.getPropertyValue(property)),
            );
            measure.innerHTML = '<div class="qirtaas-page-footnotes"><div class="qirtaas-page-footnote"></div><div class="qirtaas-page-footnote"></div></div>';
            document.body.append(measure);
            const area = measure.firstElementChild as HTMLElement;
            const rows = area.querySelectorAll<HTMLElement>(".qirtaas-page-footnote");
            const areaStyle = getComputedStyle(area);
            const separatorHeight = Number.parseFloat(areaStyle.borderTopWidth) + Number.parseFloat(areaStyle.paddingTop);
            const noteGap = Number.parseFloat(getComputedStyle(rows[1]!).marginTop);

            const pendingNotes: Omit<FootnoteData, "noteHeight">[] = [];
            view.state.doc.descendants((node, pos) => {
              if (node.type.name !== "footnoteRef") return;
              const dom = view.nodeDOM(pos);
              if (!(dom instanceof HTMLElement)) return;

              const markerTop = dom.getBoundingClientRect().top;
              const page = 1 + gapBottoms.filter((bottom) => bottom <= markerTop).length;
              pendingNotes.push({
                id: node.attrs.id || String(pos),
                markerOffset: continuousPageStart(page) + Math.max(0, markerTop - pageStart(page)),
                bracketStyle: node.attrs.bracketStyle,
                content: node.attrs.content,
                number: node.attrs.number,
              });
            });

            area.replaceChildren();
            const fragment = document.createDocumentFragment();
            const measurementRows = pendingNotes.map((note) => {
              const row = document.createElement("div");
              row.className = "qirtaas-page-footnote";
              const number = arabicNumber(note.number);
              const marker = note.bracketStyle === "brackets" ? `[${number}]` : `(${number})`;
              row.textContent = `${marker} ${note.content}`;
              fragment.append(row);
              return row;
            });
            area.append(fragment);
            const notes: FootnoteData[] = pendingNotes.map((note, index) => ({
              ...note,
              noteHeight: measurementRows[index]!.getBoundingClientRect().height,
            }));
            measure.remove();

            const placement = placeFootnotes(notes, capacity, separatorHeight, noteGap);
            const notesById = new Map(notes.map((note) => [note.id, note]));
            const notesByPage = new Map<number, FootnoteData[]>();
            placement.forEach(({ page, id }) => {
              const note = notesById.get(id);
              if (!note) return;
              const pageNotes = notesByPage.get(page) ?? [];
              pageNotes.push(note);
              notesByPage.set(page, pageNotes);
            });

            const nextPages = new Set(notesByPage.keys());
            const allPages = new Set([...renderedPages, ...nextPages]);
            renderedPages = nextPages;
            allPages.forEach((page) => editor.commands.updateFooterContent(
              "",
              notesByPage.has(page) ? renderNotes(notesByPage.get(page)!, page, editor.isEditable) : "",
              page,
            ));
          };

          const schedule = () => {
            window.clearTimeout(timer);
            cancelAnimationFrame(firstFrame);
            cancelAnimationFrame(secondFrame);
            timer = window.setTimeout(() => {
              clearRenderedNotes();
              firstFrame = requestAnimationFrame(() => {
                secondFrame = requestAnimationFrame(measureAndPlace);
              });
            }, 80);
          };

          schedule();
          return {
            update: (_updatedView, previousState) => {
              if (previousState.doc !== view.state.doc) schedule();
            },
            destroy: () => {
              window.clearTimeout(timer);
              cancelAnimationFrame(firstFrame);
              cancelAnimationFrame(secondFrame);
            },
          };
        },
      }),
    ];
  },
});
