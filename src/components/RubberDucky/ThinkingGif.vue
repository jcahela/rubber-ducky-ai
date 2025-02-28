<script setup>
import loadingGif from '@/assets/loading.gif';
import thoughtBubble from '@/assets/thought-bubble.png';
</script>

<template>
  <div class="loading-screen no-select">
    <img
      :src="thoughtBubble"
      alt="Thinking..."
      class="thought-bubble no-select"
    />
    <img :src="loadingGif" alt="Thinking..." class="loading-gif no-select" />
  </div>
</template>

<style scoped>
.loading-screen {
  height: 100%;
  position: relative;
}

.thought-bubble {
  width: 200px;
  height: auto;
  transform: translateY(30px) translateX(-20px);
}

.loading-gif {
  width: 50px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-90%, -15%);
}

.no-select {
  user-select: none; /* Standard syntax */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
}
</style>
