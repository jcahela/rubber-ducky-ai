<script setup>
import { computed } from 'vue'

const props = defineProps({
  audioLevel: {
    type: Number,
    default: 0.6,
    validator: (value) => value >= 0 && value <= 1
  }
})

// Constants
const width = 400
const height = 100
const maxAmplitude = 100
const centerY = height / 2
const straightLineLength = 50
const waveWidth = width - (straightLineLength * 2)
const transitionLength = 20 // Length of the smooth transition curve

// Computed wave path based on audio level
const wavePath = computed(() => {
  const currentAmplitude = maxAmplitude * props.audioLevel
  const waveStart = straightLineLength
  const segment = waveWidth / 3
  
  return `
    M 0,${centerY}
    L ${waveStart - transitionLength},${centerY}
    Q ${waveStart},${centerY} 
      ${waveStart + transitionLength},${centerY - currentAmplitude * 0.5}
    C ${waveStart + segment * 0.25},${centerY - currentAmplitude} 
      ${waveStart + segment * 0.75},${centerY + currentAmplitude} 
      ${waveStart + segment},${centerY}
    C ${waveStart + segment * 1.25},${centerY - currentAmplitude} 
      ${waveStart + segment * 1.75},${centerY + currentAmplitude} 
      ${waveStart + segment * 2},${centerY}
    C ${waveStart + segment * 2.25},${centerY - currentAmplitude} 
      ${waveStart + segment * 2.75},${centerY + currentAmplitude} 
      ${waveStart + segment * 3 - transitionLength},${centerY + currentAmplitude * 0.5}
    Q ${width - straightLineLength},${centerY}
      ${width - straightLineLength + transitionLength},${centerY}
    L ${width},${centerY}
  `.trim()
})
</script>

<template>
  <svg 
    class="w-full h-24" 
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="none"
  >
    <path
      :d="wavePath"
      stroke="#2563eb"
      stroke-width="2"
      fill="none"
      class="transition-all duration-200 ease-in-out"
    />
  </svg>
</template>

<style scoped>

</style>
