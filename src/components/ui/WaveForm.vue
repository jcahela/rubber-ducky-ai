<script setup>
import WaveSurfer from 'wavesurfer.js';
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useVoiceRecording } from '../../composables/useVoiceRecording';

const { audioUrl } = useVoiceRecording();

const wavesurfer = ref(null);

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
</script>

<template>
  <div id="waveform"></div>
</template>

<style lang="postcss" scoped>
#waveform {
  border: 1px solid rgb(116, 116, 116);
  border-radius: 5px;
  width: 100%;
}
</style>
