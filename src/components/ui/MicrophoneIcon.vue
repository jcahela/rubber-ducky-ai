<script setup>
const props = defineProps({
  // Size props
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  // Color props
  microphoneHeadColor: {
    type: String,
    default: '#000000'
  },
  fillMicrophone: {
    type: Boolean,
    default: false
  },
  microphoneStandColor: {
    type: String,
    default: '#000000'
  },
  className: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <svg 
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    class="microphone"
  >
    <g>
      <!-- Microphone Head (Top Part) -->
      <path
        :fill="fillMicrophone ? microphoneHeadColor : '#FFFFFF'"
        :stroke="microphoneHeadColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 15C10.343 15 9 13.657 9 12V5C9 3.343 10.343 2 12 2C13.657 2 15 3.343 15 5V12C15 13.657 13.657 15 12 15Z"
      />

      <!-- Microphone Stand (Lower Part) -->
      <path
        :stroke="microphoneStandColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.134 19 12 19M12 19V22M8 22H16"
      />
    </g>
  </svg>
</template>

<style scoped>
svg {
  display: block;
}

svg:hover {
  cursor: pointer;
}

.microphone {
  transition: transform 0.3s ease;
  transform-origin: center center;
}

.microphone:active {
  transform: scale(0.9);
}
</style>
