<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { NodeViewWrapper } from "@tiptap/vue-3";
import type { Editor } from "@tiptap/core";
import type { FootnoteBracketStyle } from "./extensions/Footnote";

const props = defineProps<{
  node: { attrs: { id: string; content: string; bracketStyle: FootnoteBracketStyle; number: number } };
  editor: Editor;
  updateAttributes: (attrs: Record<string, unknown>) => void;
}>();

const open = ref(false);
const isEditable = ref(props.editor.isEditable);
const arabicNumber = computed(() =>
  String(props.node.attrs.number).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!),
);
const marker = computed(() =>
  props.node.attrs.bracketStyle === "brackets"
    ? `[${arabicNumber.value}]`
    : `(${arabicNumber.value})`,
);

function syncEditable() {
  isEditable.value = props.editor.isEditable;
}

onMounted(() => props.editor.on("update", syncEditable));
onBeforeUnmount(() => props.editor.off("update", syncEditable));

function save(event: Event) {
  props.updateAttributes({ content: (event.target as HTMLElement).innerText });
}
</script>

<template>
  <NodeViewWrapper as="span" class="footnote-ref" contenteditable="false">
    <button v-if="isEditable" type="button" class="footnote-marker" :aria-label="`Footnote ${props.node.attrs.number}`" @click="open = !open">{{ marker }}</button>
    <span v-else>{{ props.node.attrs.content }}</span>
    <span v-if="isEditable && open" class="footnote-popover" role="dialog" @keydown.stop @mousedown.stop>
      <span class="footnote-editor" contenteditable="true" dir="auto" @blur="save">{{ props.node.attrs.content }}</span>
    </span>
  </NodeViewWrapper>
</template>

<style scoped>
.footnote-ref { position: relative; display: inline; }
.footnote-marker { border: 0; padding: 0 0.08em; background: none; color: var(--color-accent); font: inherit; font-size: 0.72em; vertical-align: super; cursor: pointer; }
.footnote-popover { position: absolute; z-index: 20; inset-block-start: 1.5em; inset-inline-start: 0; width: 16rem; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 0.4rem; background: var(--color-bg); box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 0.15); }
.footnote-editor { display: block; min-height: 2.5rem; outline: none; white-space: pre-wrap; }
</style>
