<script setup>
defineProps({
  level: {
    type: Number,
    default: 0
  },
  position: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div 
    class="audio-tick"
    :style="{ 
      transform: `translateX(${position}px)`,
      height: `${(level < 0.4 ? 0.2 : level) * 100}%`
    }"
  />
</template>

<style>
.audio-tick {
  position: absolute;
  width: 15px;
  background-color: #3b82f6;
  right: 0;
  top: 40%;
  transform: translateY(-50%);
}
</style>
