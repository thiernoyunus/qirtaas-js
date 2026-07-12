<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper } from "@tiptap/vue-3";
import type { PoetryLayout } from "./extensions/PoetryVerse";
defineProps<{ node: { attrs: { layout: PoetryLayout } } }>();
</script>

<template>
  <NodeViewWrapper class="poetry-verse" :class="`poetry-${node.attrs.layout}`" dir="rtl">
    <NodeViewContent class="poetry-content" />
  </NodeViewWrapper>
</template>

<style scoped>
.poetry-verse { margin-block: 1rem; }
:deep([data-type="poetry-line"]) { margin-block: 0.35rem; }
.poetry-columns :deep([data-type="poetry-line"]) { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 2rem; }
.poetry-columns :deep([data-type="hemistich"]:first-child) { text-align: right; }
.poetry-columns :deep([data-type="hemistich"]:last-child) { text-align: left; }
.poetry-interleaved :deep([data-type="poetry-line"]) { display: grid; grid-template-columns: 1fr; }
.poetry-interleaved :deep([data-type="hemistich"]:first-child) { width: 72%; justify-self: start; text-align: right; }
.poetry-interleaved :deep([data-type="hemistich"]:last-child) { width: 72%; justify-self: end; text-align: left; }
:deep([data-type="hemistich"]) { min-height: 1.5em; outline: none; }
</style>
