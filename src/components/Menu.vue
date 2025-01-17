<script setup>
import { computed } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';
import AudioMeter from './ui/AudioMeter.vue';

const {
  startRecording,
  stopRecording,
  isRecording,
  getAudioBlob,
  audioLevel,
  playbackRecording,
  discardRecording,
  pausePlayback,
  isAudioPlaying
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
      :disabled="isRecording || !recordingExists || isAudioPlaying"
    >
      Play
    </button>
    <button 
      @click="pausePlayback"
      :disabled="isRecording || !recordingExists || !isAudioPlaying"
    >
      Pause
    </button>
    <button 
      @click="discardRecording" 
      :disabled="isRecording || !recordingExists || isAudioPlaying"
    >
      Discard
    </button>

    <AudioMeter v-if="isRecording" :audioLevel="audioLevel" />
    
  </div>
</template>

<style scoped>
.menu {
  height: 100%;
  width: 100%;
}
</style>
