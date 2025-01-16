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

const DEFAULT_LEVEL = 0.09;
const CALCULATED_LEVEL = props.level < 0.3 ? DEFAULT_LEVEL : props.level;
const CALCULATED_HEIGHT_PERCENTAGE = CALCULATED_LEVEL * 100;
const OFFSET_Y_PX = CALCULATED_HEIGHT_PERCENTAGE / 2;
</script>

<template>
  <div 
    class="audio-tick"
    :style="{ 
      transform: `translateX(${position}px) translateY(-${OFFSET_Y_PX}px)`,
      height: `${CALCULATED_HEIGHT_PERCENTAGE}%`
    }"
  />
</template>

<style>
.audio-tick {
  position: absolute;
  width: 4px;
  background-color: #3b82f6;
  right: 0;
  top: 50%;
  border-radius: 5px;
}
</style>
