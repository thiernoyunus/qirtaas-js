<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { NodeViewWrapper } from "@tiptap/vue-3";
import type { Editor } from "@tiptap/core";
import type { MarginNoteSide } from "./extensions/MarginNote";

const props = defineProps<{
  node: { attrs: { side: MarginNoteSide; text: string } };
  editor: Editor;
  updateAttributes: (attrs: Record<string, unknown>) => void;
}>();

const open = ref(false);
const isEditable = ref(props.editor.isEditable);
const editorEl = ref<HTMLElement | null>(null);

function syncEditable() {
  isEditable.value = props.editor.isEditable;
}

onMounted(() => props.editor.on("update", syncEditable));
onBeforeUnmount(() => props.editor.off("update", syncEditable));

// Set from the node's text once, on open, via a template ref (not a
// reactive {{ }} interpolation): flushing every keystroke into ProseMirror
// (below) would otherwise round-trip back into this element's text and
// reset the caret to the start on every input.
watch(
  () => open.value,
  (isOpen) => {
    if (isOpen) nextTick(() => { if (editorEl.value) editorEl.value.textContent = props.node.attrs.text; });
  },
);

function save(event: Event) {
  props.updateAttributes({ text: (event.target as HTMLElement).innerText });
}
</script>

<template>
  <NodeViewWrapper as="span" class="margin-note" contenteditable="false">
    <button v-if="isEditable" type="button" class="margin-note-marker" :aria-label="`Margin note, ${props.node.attrs.side} side`" @click="open = !open">هـ</button>
    <span v-else>{{ props.node.attrs.text }}</span>
    <span v-if="isEditable && open" class="margin-note-popover" role="dialog" @keydown.stop @mousedown.stop>
      <span ref="editorEl" class="margin-note-editor" contenteditable="true" dir="auto" @input="save" @blur="save"></span>
    </span>
  </NodeViewWrapper>
</template>

<style scoped>
.margin-note { position: relative; display: inline; }
.margin-note-marker { border: 0; border-radius: 0.25em; padding: 0 0.18em; background: color-mix(in srgb, var(--color-accent) 12%, transparent); color: var(--color-accent); font: inherit; font-size: 0.68em; vertical-align: super; cursor: pointer; }
.margin-note-popover { position: absolute; z-index: 20; inset-block-start: 1.5em; inset-inline-start: 0; width: 16rem; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 0.4rem; background: var(--color-bg); box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 0.15); }
.margin-note-editor { display: block; min-height: 2.5rem; outline: none; white-space: pre-wrap; }
</style>
