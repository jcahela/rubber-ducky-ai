<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AudioTick from './AudioTick.vue';

const props = defineProps({
  audioLevel: {
    type: Number,
    default: 0,
  },
});

const ticks = ref([
  { id: 1, position: -294, level: 0 },
  { id: 2, position: -287, level: 0 },
  { id: 3, position: -280, level: 0 },
  { id: 4, position: -273, level: 0 },
  { id: 5, position: -266, level: 0 },
  { id: 6, position: -259, level: 0 },
  { id: 7, position: -252, level: 0 },
  { id: 8, position: -245, level: 0 },
  { id: 9, position: -238, level: 0 },
  { id: 10, position: -231, level: 0 },
  { id: 11, position: -224, level: 0 },
  { id: 12, position: -217, level: 0 },
  { id: 13, position: -210, level: 0 },
  { id: 14, position: -203, level: 0 },
  { id: 15, position: -196, level: 0 },
  { id: 16, position: -189, level: 0 },
  { id: 17, position: -182, level: 0 },
  { id: 18, position: -175, level: 0 },
  { id: 19, position: -168, level: 0 },
  { id: 20, position: -161, level: 0 },
  { id: 21, position: -154, level: 0 },
  { id: 22, position: -147, level: 0 },
  { id: 23, position: -140, level: 0 },
  { id: 24, position: -133, level: 0 },
  { id: 25, position: -126, level: 0 },
  { id: 26, position: -119, level: 0 },
  { id: 27, position: -112, level: 0 },
  { id: 28, position: -105, level: 0 },
  { id: 29, position: -98, level: 0 },
  { id: 30, position: -91, level: 0 },
  { id: 31, position: -84, level: 0 },
  { id: 32, position: -77, level: 0 },
  { id: 33, position: -70, level: 0 },
  { id: 34, position: -63, level: 0 },
  { id: 35, position: -56, level: 0 },
  { id: 36, position: -49, level: 0 },
  { id: 37, position: -42, level: 0 },
  { id: 38, position: -35, level: 0 },
  { id: 39, position: -28, level: 0 },
  { id: 40, position: -21, level: 0 },
  { id: 41, position: -14, level: 0 },
  { id: 42, position: -7, level: 0 },
  { id: 43, position: 0, level: 0 },
]);
const containerWidth = 300;
const jumpSize = 6; // Size of each jump - smaller for closer ticks
const tickSpacing = jumpSize; // Match spacing to jump size for stationary effect
const frameInterval = 50; // Time between jumps

let intervalId = null;

const createTick = () => {
  return {
    id: Date.now(),
    position: 0,
    level: props.audioLevel,
  };
};

const updateTicks = () => {
  // Update positions
  ticks.value = ticks.value
    .map((tick) => ({
      ...tick,
      position: tick.position - jumpSize,
    }))
    .filter((tick) => tick.position > -containerWidth);

  if (
    ticks.value.length === 0 ||
    ticks.value[ticks.value.length - 1].position <= -tickSpacing
  ) {
    ticks.value.push(createTick());
  }
  // TODO: Talk about how this works at preventing jaggedness by averaging the ticks at index 1 using the levels of the surrounding ticks
  if (
    ticks.value[1].level < ticks.value[0].level &&
    ticks.value[1].level < ticks.value[2].level
  ) {
    ticks.value[1].level = (ticks.value[0].level + ticks.value[2].level) / 2;
  }
};

onMounted(() => {
  intervalId = setInterval(updateTicks, frameInterval);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="audio-meter-container">
    <div class="audio-water"></div>
    <AudioTick
      v-for="tick in ticks"
      :key="tick.id"
      :level="tick.level"
      :position="tick.position"
    />
  </div>
</template>

<style>
.audio-meter-container {
  position: relative;
  width: 300px;
  height: 64px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  overflow: hidden;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
}

.audio-water {
  background-color: #3bb2f6;
  height: 20px;
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>
