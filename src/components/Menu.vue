<script setup>
import { computed, ref, onMounted } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';
import AudioMeter from './ui/AudioMeter.vue';

const {
  isRecording,
  audioLevel,
  isAudioPlaying,
  recordingExists,
  microphoneSelected,
  selectingMicrophone,
  selectedMicrophoneId,
  microphones,
  startRecording,
  stopRecording,
  playbackRecording,
  discardRecording,
  pausePlayback,
  getMicrophones
} = useVoiceRecording();


onMounted(() => {
  getMicrophones();
})

</script>

<template>
  <div class="menu">
    <AudioMeter class="audio-meter" :audioLevel="audioLevel" />

    <div class="controller">

      <div v-if="!microphoneSelected">
        <button @click="console.log('show modal for mic selection'); selectingMicrophone = true">
          Select Microphone
        </button>
      </div>

      <div v-else>
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

      <div v-if="selectingMicrophone">
        <div
          v-for="microphone in microphones" @click="microphoneSelected = true; selectingMicrophone = false; selectedMicrophoneId = microphone.id; console.log(selectedMicrophoneId)"
          class="microphone-selection"
        >
          {{  microphone.label }}
        </div>

      </div>
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
    flex-direction: column;
    justify-content: center;
    margin-top: 2rem;

    .microphone-selection:hover {
      cursor: pointer;
      font-weight: bold;
      border: 1px solid black;
    }
  }

}


</style>
