<script setup>
import { computed } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';

const {
  startRecording,
  stopRecording,
  isRecording,
  getAudioBlob,
  audioLevel,
  playbackRecording,
  discardRecording
} = useVoiceRecording();

const recordingExists = computed(() => {
  return !!getAudioBlob();
})

</script>

<template>
  <div class="menu">
    <button 
      v-if="!isRecording" 
      @click="startRecording"
      :disabled="isRecording || recordingExists"
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
      :disabled="isRecording || !recordingExists"
    >
      Play Recording
    </button>
    <button 
      @click="discardRecording" 
      :disabled="isRecording || !recordingExists"
    >
      Discard Recording
    </button>
    
  </div>
</template>

<style scoped>
.menu {
  height: 100%;
  width: 100%;
}
</style>
