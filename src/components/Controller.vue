<script setup>
import { ref } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';
import AudioMeter from './ui/AudioMeter.vue';

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
    <AudioMeter class="audio-meter" :audioLevel="audioLevel" />

    <div class="controller">
      <button 
      v-if="!isRecording" 
      @click="startRecording"
      :disabled="isRecording || audioBlob"
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

    <p>Transcription: {{ transcription }}</p>
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
