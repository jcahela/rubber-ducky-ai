<script setup>
import { ref, onMounted, watch } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';
import AudioMeter from './ui/AudioMeter.vue';
import WaveForm from './ui/WaveForm.vue';
import DuckyWithSpeechBubble from './RubberDucky/DuckyWithSpeechBubble.vue';

const {
  isRecording,
  audioLevel,
  audioBlob,
  audioUrl,
  preferredMicrophoneId,
  startRecording,
  stopRecording,
  discardRecording
} = useVoiceRecording();

const transcription = ref('');
const allAudioInputDevices = ref([]);
const selectedMicrophone = ref({});
const showSelectMicrophone = ref(false);

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

onMounted(async () => {
  allAudioInputDevices.value = (await navigator.mediaDevices.enumerateDevices())
    .filter((device) => device.kind === 'audioinput' && !device.label.toLowerCase().includes('virtual'))
    .map((physicalAudioDevice) => ({ label: physicalAudioDevice.label, deviceId: physicalAudioDevice.deviceId }));

  selectedMicrophone.value = allAudioInputDevices.value.find((device) => device.deviceId === 'default');
});

watch(preferredMicrophoneId, (newPreferredMicrophoneId) => {
  const newMicrophone = allAudioInputDevices.value.find((mic) => mic.deviceId === newPreferredMicrophoneId)
  selectedMicrophone.value = newMicrophone;
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

    <WaveForm v-show="!isRecording && audioUrl"/>

    <div
      v-if="!isRecording && audioBlob"
      class="controller"
    >
      <button @click="discardRecording">
        Discard
      </button>

      <button @click="handleTranscribe">
        Transcribe
      </button>
    </div>

    <p class="change-mic-collapsed" @click="showSelectMicrophone = !showSelectMicrophone">Change selected microphone</p>

    <div v-if="showSelectMicrophone">
      <div class="microphone-list">
        Microphones:
        <select v-model="preferredMicrophoneId">
          <option
            v-for="microphone in allAudioInputDevices"
            :value="microphone.deviceId"
            :selected="microphone.deviceId === selectedMicrophone.deviceId"
          >
            {{ microphone.label }}
          </option>
        </select>
      </div>

      <br/>
    </div>

    <div class="default-mic">
      Selected Microphone:<br/> {{ selectedMicrophone.label }}
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

  .change-mic-collapsed {
    width: fit-content;
    text-decoration: underline;
    font-size: 14px;
    margin-right: auto;
  }

  .change-mic-collapsed:hover {
    cursor: pointer;
  }

  .default-mic {
    width: 100%;
  }
}


</style>
