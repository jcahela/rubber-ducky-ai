<script setup>
import WaveSurfer from 'wavesurfer.js';
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useVoiceRecording } from '../../../composables/useVoiceRecording';
import PlayIcon from './PlayIcon.vue';
import PauseIcon from './PauseIcon.vue';

const { audioUrl } = useVoiceRecording();

const wavesurfer = ref(null);
const isPlaying = ref(false);

onMounted(() => {
  wavesurfer.value = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#3bb2f6',
    progressColor: '#1a7bbf',
    cursorColor: '#0e5a94',
    url: audioUrl.value,
    height: '60',
    barHeight: 3,
    dragToSeek: true,
    cursorWidth: 2,
    plugins: [
      Hover.create({
        lineColor: '#ff6b6b',
        labelBackground: '#2f2f2f',
        labelColor: '#ffffff',
        lineWidth: 2,
        labelSize: '11px',
      })
    ]
  });

  wavesurfer.value.on('finish', () => {
    isPlaying.value = false;
  })
  
});

onUnmounted(() => {
  if (wavesurfer.value) {
    wavesurfer.value.destroy();
  }
});

watch(audioUrl, (newUrl) => {
  if (newUrl && wavesurfer.value) {
    wavesurfer.value.load(newUrl);
  }
});

function handlePlayPause() {
  wavesurfer.value.playPause();
  isPlaying.value = !isPlaying.value;
}
</script>

<template>
  <div class="waveform-container">
    <PlayIcon
      v-if="!isPlaying"
      class="play"
      width="40px"
      height="40px"
      @click="handlePlayPause"
    />

    <PauseIcon
      v-else
      class="pause"
      width="40px"
      height="40px"
      @click="handlePlayPause"
    />

    <div id="waveform"></div>
  </div>
</template>

<style lang="postcss" scoped>
#waveform {
  width: 100%;
  border-left: 1px solid rgb(116, 116, 116);
}

.waveform-container {
  border: 1px solid rgb(116, 116, 116);
  border-radius: 5px;
  width: 100%;
  display: flex;
  align-items: center;
}

.play, .pause {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
