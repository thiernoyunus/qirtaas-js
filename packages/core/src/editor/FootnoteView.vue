<script setup lang="ts">
import { computed, ref } from "vue";
import { NodeViewWrapper } from "@tiptap/vue-3";
import type { FootnoteBracketStyle } from "./extensions/Footnote";

const props = defineProps<{
  node: { attrs: { id: string; content: string; bracketStyle: FootnoteBracketStyle; number: number } };
  updateAttributes: (attrs: Record<string, unknown>) => void;
}>();

const open = ref(false);
const arabicNumber = computed(() =>
  String(props.node.attrs.number).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!),
);
const marker = computed(() =>
  props.node.attrs.bracketStyle === "brackets"
    ? `[${arabicNumber.value}]`
    : `(${arabicNumber.value})`,
);

function save(event: Event) {
  props.updateAttributes({ content: (event.target as HTMLElement).innerText });
}
</script>

<template>
  <NodeViewWrapper as="span" class="footnote-ref" contenteditable="false">
    <button type="button" class="footnote-marker" :aria-label="`Footnote ${props.node.attrs.number}`" @click="open = !open">{{ marker }}</button>
    <span v-if="open" class="footnote-popover" role="dialog">
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
