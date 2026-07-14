export interface MeasuredFootnote {
  id: string;
  markerOffset: number;
  noteHeight: number;
}

export interface PlacedFootnote extends MeasuredFootnote {
  page: number;
}

/**
 * Compose pages from start to finish. Notes shrink only the page containing
 * their marker, so placement never bounces backward between two pages.
 */
export function placeFootnotes(
  footnotes: MeasuredFootnote[],
  pageCapacity: (page: number) => number,
  separatorHeight: number,
  noteGap: number,
): PlacedFootnote[] {
  const placed: PlacedFootnote[] = [];
  let page = 1;
  let pageStart = 0;
  let notesHeight = 0;

  for (const footnote of [...footnotes].sort((a, b) => a.markerOffset - b.markerOffset)) {
    while (footnote.markerOffset >= pageStart + pageCapacity(page) - notesHeight) {
      pageStart += pageCapacity(page) - notesHeight;
      page += 1;
      notesHeight = 0;
    }

    const addedHeight = footnote.noteHeight + (notesHeight ? noteGap : separatorHeight);
    if (footnote.markerOffset >= pageStart + pageCapacity(page) - notesHeight - addedHeight) {
      pageStart += pageCapacity(page) - notesHeight;
      page += 1;
      notesHeight = 0;
    }

    notesHeight += footnote.noteHeight + (notesHeight ? noteGap : separatorHeight);
    placed.push({ ...footnote, page });
  }

  return placed;
}
