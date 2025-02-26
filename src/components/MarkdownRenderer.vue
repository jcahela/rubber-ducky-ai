<script setup>
import { toRef, ref, watch, onMounted } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const props = defineProps({
  markdown: {
    type: String,
    required: true,
  },
});

const markdownContainer = ref(null);

const renderMarkdown = (markdown) => {
  if (!markdown) return '';
  const rawHtml = marked(markdown);
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  markdownContainer.value.innerHTML = cleanHtml;
};

watch(toRef(props, 'markdown'), (newMarkdown) => {
  renderMarkdown(newMarkdown);
});

onMounted(() => {
  renderMarkdown(props.markdown);
});
</script>

<template>
  <div ref="markdownContainer"></div>
</template>
