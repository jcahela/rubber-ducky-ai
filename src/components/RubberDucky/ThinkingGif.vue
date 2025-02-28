<script setup>
import loadingGif from '@/assets/loading.gif';
import thoughtBubble from '@/assets/thought-bubble.png';
</script>

<template>
  <div class="loading-screen">
    <img :src="thoughtBubble" alt="Thinking..." class="thought-bubble" />
    <img :src="loadingGif" alt="Thinking..." class="loading-gif" />
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
</style>
