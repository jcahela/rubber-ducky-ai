<script setup>
import { toRef, ref, watch, onMounted } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import MermaidDiagram from './MarkdownRenderer/MermaidDiagram.vue';

const props = defineProps({
  markdown: {
    type: String,
    required: true,
  },
});

const markdownContainer = ref(null);
const contentBlocks = ref([]);

// Function to decode HTML entities
const decodeHtmlEntities = (text) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const renderMarkdown = (markdown) => {
  if (!markdown) return '';
  const rawHtml = marked(markdown);
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  // Extract Mermaid diagrams and split the content into blocks
  const mermaidRegex =
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g;
  const blocks = [];
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(cleanHtml)) !== null) {
    // Add content before the Mermaid diagram
    if (match.index > lastIndex) {
      blocks.push({
        type: 'html',
        content: cleanHtml.substring(lastIndex, match.index),
      });
    }

    // Add the Mermaid diagram (decode HTML entities)
    const mermaidContent = decodeHtmlEntities(match[1].trim());
    blocks.push({
      type: 'mermaid',
      content: mermaidContent,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining content after the last Mermaid diagram
  if (lastIndex < cleanHtml.length) {
    blocks.push({
      type: 'html',
      content: cleanHtml.substring(lastIndex),
    });
  }

  contentBlocks.value = blocks;
};

watch(toRef(props, 'markdown'), (newMarkdown) => {
  renderMarkdown(newMarkdown);
});

onMounted(() => {
  renderMarkdown(props.markdown);
});
</script>

<template>
  <div ref="markdownContainer">
    <template v-for="(block, index) in contentBlocks" :key="index">
      <div v-if="block.type === 'html'" v-html="block.content"></div>
      <MermaidDiagram v-else-if="block.type === 'mermaid'">
        {{ block.content }}
      </MermaidDiagram>
    </template>
  </div>
</template>
