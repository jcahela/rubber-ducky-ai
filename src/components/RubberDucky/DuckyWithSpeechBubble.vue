<script setup>
import RubberDuckyIcon from './RubberDuckyIcon.vue';
import SpeechBubble from './SpeechBubble.vue';

const props = defineProps({
  onDuckyClick: {
    type: Function,
    default: () => { (console.log('Quack!')) }
  }
});
</script>

<template>
  <SpeechBubble>
    <slot></slot>
  </SpeechBubble>
  <RubberDuckyIcon
    height="75px"
    width="75px"
    @click="onDuckyClick"
  />
</template>

<style lang="postcss" scoped>

</style>
