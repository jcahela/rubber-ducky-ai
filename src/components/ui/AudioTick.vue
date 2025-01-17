<script setup>
const props = defineProps({
  level: {
    type: Number,
    default: 0
  },
  position: {
    type: Number,
    required: true
  }
})
const MIN_LEVEL = 0.09;
const MAX_LEVEL = 0.85;

const adjustedLevel = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.round(props.level * 100) / 100))
const calculatedHeightPercentage = adjustedLevel * 100;
</script>

<template>
  <div 
    class="audio-tick"
    :style="{ 
      transform: `translateX(${position}px)`,
      height: `${calculatedHeightPercentage}%`
    }"
  />
</template>

<style>
.audio-tick {
  position: absolute;
  width: 4px;
  background-color: #3bb2f6;
  right: 0;
  bottom: 19%;
  border: 1px solid #3bb2f6;
  border-radius: 5px;
}
</style>
