<script setup>
import WaveSurfer from 'wavesurfer.js';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';
import AudioMeter from './ui/AudioMeter.vue';
import DuckyWithSpeechBubble from './RubberDucky/DuckyWithSpeechBubble.vue';

const {
  isRecording,
  audioLevel,
  audioBlob,
  audioUrl,
  startRecording,
  stopRecording,
  discardRecording
} = useVoiceRecording();

const transcription = ref('');
const wavesurfer = ref(null);
const currentTime = ref('0.00');
const duration = ref(null);

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

onMounted(() => {
  wavesurfer.value = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#3bb2f6',
    progressColor: '#1a7bbf',
    url: audioUrl.value,
    height: '60',
    cursorColor: '#ddd5e9',
    dragToSeek: true,
    cursorWidth: 2
  });
  
  wavesurfer.value.on('click', () => {
    currentTime.value = wavesurfer.value.getCurrentTime().toFixed(2);
  });

  wavesurfer.value.on('dragend', () => {
    currentTime.value = wavesurfer.value.getCurrentTime().toFixed(2);
  });

  wavesurfer.value.on('play', () => {
    currentTime.value = wavesurfer.value.getCurrentTime().toFixed(2);
  })

  wavesurfer.value.on('ready', () => {
    duration.value = wavesurfer.value.getDuration();
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
    <div
      v-show="!isRecording && audioUrl"
      id="waveform"
    >
    </div>


    <div
      v-if="!isRecording && wavesurfer && audioBlob"
      class="controller"
    >
      <button @click="wavesurfer.playPause">
        Play/Pause
      </button>

      {{ currentTime }} / {{ duration }}

      <button @click="discardRecording">
        Discard
      </button>

      <button @click="handleTranscribe">
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

  #waveform {
    border: 1px solid black;
    width: 100%;
  }

}


</style>
