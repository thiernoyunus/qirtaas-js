<script setup lang="ts">
import { computed } from "vue";
import { NodeViewWrapper } from "@tiptap/vue-3";
import { HONORIFICS, type HonorificType } from "./extensions/Honorific";

const props = defineProps<{
  node: { attrs: { type: HonorificType } };
}>();

const glyph = computed(() => HONORIFICS[props.node.attrs.type]);
</script>

<template>
  <NodeViewWrapper as="span" class="inline" contenteditable="false">
    <span class="honorific" dir="rtl" :title="glyph.phrase">
      {{ glyph.glyph }}
    </span>
  </NodeViewWrapper>
</template>

<style scoped>
.honorific {
  font-size: 0.8em;
  line-height: 1;
  vertical-align: baseline;
  color: var(--color-accent);
  cursor: default;
}
</style>
