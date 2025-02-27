<script setup>
import { ref, onMounted, watch } from 'vue';
import mermaid from 'mermaid';

// Ref for the container
const mermaidContainer = ref(null);

// Initialize Mermaid
mermaid.initialize({ startOnLoad: false });

// Render the diagram
const renderDiagram = async () => {
  if (mermaidContainer.value) {
    await mermaid.run({
      querySelector: '.mermaid',
    });
  }
};

// Render on mount
onMounted(() => {
  renderDiagram();
});

// Re-render when the chart prop changes
watch(
  () => mermaidContainer.value?.textContent,
  () => {
    renderDiagram();
  }
);
</script>

<template>
  <div ref="mermaidContainer" class="mermaid">
    <slot></slot>
  </div>
</template>

<style scoped>
.mermaid {
  text-align: center;
}
</style>
