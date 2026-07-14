import assert from "node:assert/strict";
import test from "node:test";
import { placeFootnotes } from "../packages/core/src/editor/bookFootnoteLayout.ts";

const capacity = () => 1000;

test("keeps a small note with its reference", () => {
  assert.equal(placeFootnotes([
    { id: "a", markerOffset: 100, noteHeight: 200 },
  ], capacity, 20, 10)[0]?.page, 1);
});

test("moves a reference and its note forward when the note consumes the remaining space", () => {
  assert.equal(placeFootnotes([
    { id: "a", markerOffset: 900, noteHeight: 200 },
  ], capacity, 20, 10)[0]?.page, 2);
});

test("lets page notes consume most of a page", () => {
  assert.equal(placeFootnotes([
    { id: "a", markerOffset: 100, noteHeight: 780 },
  ], capacity, 20, 10)[0]?.page, 1);
});

test("places later notes after space reserved by earlier notes", () => {
  assert.deepEqual(
    placeFootnotes([
      { id: "a", markerOffset: 100, noteHeight: 200 },
      { id: "b", markerOffset: 700, noteHeight: 200 },
    ], capacity, 20, 10).map(({ page }) => page),
    [1, 2],
  );
});
