<script setup>
import RubberDuckyIcon from './RubberDuckyIcon.vue';
import SpeechBubble from './SpeechBubble.vue';
import ThinkingGif from './ThinkingGif.vue';

defineProps({
  onDuckyClick: {
    type: Function,
    default: () => {
      console.log('Quack!');
    },
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <ThinkingGif v-if="isLoading" />
  <SpeechBubble v-else>
    <slot></slot>
  </SpeechBubble>
  <RubberDuckyIcon height="75px" width="75px" @click="onDuckyClick" />
</template>

<style lang="postcss" scoped></style>
