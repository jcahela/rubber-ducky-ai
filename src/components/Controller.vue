<script setup>
import { ref } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';
import AudioMeter from './ui/AudioMeter.vue';
import MicrophoneIcon from './ui/MicrophoneIcon.vue';

const {
  startRecording,
  stopRecording,
  isRecording,
  isAudioPlaying,
  audioLevel,
  audioBlob,
  playbackRecording,
  discardRecording,
  pausePlayback,
} = useVoiceRecording();

const transcription = ref('');

async function handleTranscribe() {
  if (!audioBlob.value) return

  try {
    const formData = new FormData();
    formData.append('audio', audioBlob.value, 'audio.webm');

    const response = await fetch('http://localhost:3001/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const { transcription: result } = await response.json();
    transcription.value = result;

    console.log('Transcription successful: ', result);
  } catch (error) {
    console.error('Transcription failed: ', error);
  }
}

</script>

<template>
  <div class="menu">
    <div>
      <p>
        1. Press the microphone icon to start recording.
      </p>
      
      <p>
        2. Press it again to stop recording.
      </p>
    </div>

    <!-- TODO: implement glowing orange dot to denote it's recording -->
    <MicrophoneIcon   
      width="50px"
      height="50px"
      :fillMicrophone="isRecording"
      @click="isRecording ? stopRecording() : startRecording()"
    />

    <AudioMeter
      v-if="isRecording || audioBlob"
      class="audio-meter"
      :audioLevel="audioLevel"
    />

    <div
      v-if="isRecording || audioBlob"
      class="controller"
    >
      
      <button 
        @click="playbackRecording" 
        :disabled="isRecording || !audioBlob || isAudioPlaying"
      >
        Play
      </button>
      <button 
        @click="pausePlayback"
        :disabled="isRecording || !audioBlob || !isAudioPlaying"
      >
        Pause
      </button>
      <button 
        @click="discardRecording" 
        :disabled="isRecording || !audioBlob || isAudioPlaying"
      >
        Discard
      </button>

      <button 
        @click="handleTranscribe" 
        :disabled="isRecording || !audioBlob || isAudioPlaying"
      >
        Transcribe
      </button>

      <p v-if="transcription">Transcription: {{ transcription }}</p>
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
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-top: 2rem;
  }

}


</style>
