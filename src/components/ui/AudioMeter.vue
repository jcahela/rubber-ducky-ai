<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AudioTick from './AudioTick.vue'

const props = defineProps({
  audioLevel: {
    type: Number,
    default: 0
  }
})

const ticks = ref([])
const containerWidth = 300
const jumpSize = 7 // Size of each jump - smaller for closer ticks
const tickSpacing = jumpSize // Match spacing to jump size for stationary effect
const frameInterval = 50 // Time between jumps

let intervalId = null

const createTick = () => {
  return {
    id: Date.now(),
    position: 0,
    level: props.audioLevel
  }
}

const updateTicks = () => {
  // Update positions
  ticks.value = ticks.value
    .map(tick => ({
      ...tick,
      position: tick.position - jumpSize
    }))
    .filter(tick => tick.position > -containerWidth)

  // Add new tick when the last tick has moved by exactly the tick spacing
  if (ticks.value.length === 0 || 
      ticks.value[ticks.value.length - 1].position <= -tickSpacing) {
    ticks.value.push(createTick())
  }
}

onMounted(() => {
  intervalId = setInterval(updateTicks, frameInterval)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="audio-meter">
    <AudioTick 
      v-for="tick in ticks"
      :key="tick.id"
      :level="tick.level"
      :position="tick.position"
    />
  </div>
</template>

<style>
.audio-meter {
  position: relative;
  width: 300px;
  height: 64px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  overflow: visible;
}
</style>
