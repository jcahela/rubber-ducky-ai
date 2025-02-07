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
    <AudioMeter class="audio-meter" :audioLevel="audioLevel" />

    <div class="controller">
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
    </div>
    
  </div>
</template>

<style lang="postcss" scoped>
.menu {
  height: 100%;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .audio-meter {
    margin-top: 2rem;
  }

  .controller {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

}


</style>
