<script setup>
import { computed } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';

const {
  startRecording,
  stopRecording,
  isRecording,
  getAudioBlob
} = useVoiceRecording();

const playbackRecording = async () => {
  const audioBlob = await getAudioBlob();

  if (audioBlob) {
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.play();
  }
};

const recordingExists = computed(() => {
  return !!getAudioBlob();
})

</script>

<template>
  <div class="menu">
    <button 
            v-if="!isRecording" 
            @click="startRecording"
        >
            Start Recording
        </button>
        <button 
            v-else 
            @click="stopRecording"
        >
            Stop Recording
        </button>
        
        <button 
            @click="playbackRecording" 
            :disabled="!recordingExists"
        >
            Play Recording
        </button>
  </div>
</template>

<style scoped>
.menu {
  height: 100%;
  width: 100%;
}
</style>
