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

const BASE_LEVEL = 0.09;
const AUDIO_THRESHOLD = 0.3;
const CALCULATED_LEVEL = props.level < AUDIO_THRESHOLD ? BASE_LEVEL : props.level;
const CALCULATED_HEIGHT_PERCENTAGE = CALCULATED_LEVEL * 100;
</script>

<template>
  <div 
    class="audio-tick"
    :style="{ 
      transform: `translateX(${position}px)`,
      height: `${CALCULATED_HEIGHT_PERCENTAGE}%`
    }"
  />
</template>

<style>
.audio-tick {
  position: absolute;
  width: 4px;
  background-color: #3bb2f6;
  right: 0;
  top: 50%;
  transform-origin: center;
  translate: 0 -50%;
  border-radius: 5px;
}
</style>
