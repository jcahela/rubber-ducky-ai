<script setup>
import { ref } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';
import AudioMeter from './ui/AudioMeter.vue';
import DuckyWithSpeechBubble from './RubberDucky/DuckyWithSpeechBubble.vue';

const {
  isRecording,
  isAudioPlaying,
  audioLevel,
  audioBlob,
  duration,
  startRecording,
  stopRecording,
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

function toggleRecording() {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
}
</script>

<template>
  <div class="menu">
    <DuckyWithSpeechBubble :onDuckyClick="toggleRecording">
      <div v-if="transcription">
        {{ transcription }}
      </div>

      <div v-else>
        <div v-if="!isRecording && !audioBlob">
          <p>1. Click me to start recording</p>
          <p>2. Click me again to stop recording</p>
        </div>
  
        <div v-else-if="isRecording">
          <p style="text-align: center;">I'm listening!</p>
          <p style="text-align: center;">Click me again to stop recording</p>
        </div>
  
        <div v-else-if="audioBlob">
          <p>I've saved your wonderful recording!</p>
        </div>
      </div>
    </DuckyWithSpeechBubble>
    
    <AudioMeter
      v-if="isRecording"
      class="audio-meter"
      :audioLevel="audioLevel"
    />

    <div v-if="!isRecording && audioBlob && duration">
      0:00 / {{ duration }}
    </div>


    <div
      v-if="!isRecording && audioBlob"
      class="controller"
    >
      
      <button 
        @click="playbackRecording" 
        :disabled="!audioBlob || isAudioPlaying"
      >
        Play
      </button>
      <button 
        @click="pausePlayback"
        :disabled="!audioBlob || !isAudioPlaying"
      >
        Pause
      </button>
      <button 
        @click="discardRecording" 
        :disabled="!audioBlob || isAudioPlaying"
      >
        Discard
      </button>

      <button 
        @click="handleTranscribe" 
        :disabled="!audioBlob || isAudioPlaying"
      >
        Transcribe
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
    margin-top: -14px;
  }

  .controller {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }

}


</style>
