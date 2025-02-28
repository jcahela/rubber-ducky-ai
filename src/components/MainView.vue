<script setup>
import { ref, onMounted, watch } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';
import AudioMeter from './ui/AudioMeter.vue';
import WaveForm from './ui/WaveForm/WaveForm.vue';
import DuckyWithSpeechBubble from './RubberDucky/DuckyWithSpeechBubble.vue';
import MarkdownRenderer from '../components/MarkdownRenderer/MarkdownRenderer.vue';

const {
  isRecording,
  audioLevel,
  audioBlob,
  audioUrl,
  preferredMicrophoneId,
  startRecording,
  stopRecording,
  discardRecording,
} = useVoiceRecording();

const response = ref('');
const allAudioInputDevices = ref([]);
const selectedMicrophone = ref({});
const showSelectMicrophone = ref(false);

async function handleTranscribeAndResponse() {
  if (!audioBlob.value) return;

  try {
    const formData = new FormData();
    formData.append('audio', audioBlob.value, 'audio.webm');

    const fetchedResponse = await fetch(
      'http://localhost:3001/generateDiagram',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!fetchedResponse.ok) {
      throw new Error('Failed to deliver response');
    }

    response.value = await fetchedResponse.text();
  } catch (error) {
    console.error('Response failed: ', error);
  }
}

function toggleRecording() {
  if (response.value) {
    response.value = '';
    discardRecording();
  }
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
}

onMounted(async () => {
  allAudioInputDevices.value = (await navigator.mediaDevices.enumerateDevices())
    .filter(
      (device) =>
        device.kind === 'audioinput' &&
        !device.label.toLowerCase().includes('virtual')
    )
    .map((physicalAudioDevice) => ({
      label: physicalAudioDevice.label,
      deviceId: physicalAudioDevice.deviceId,
    }));

  selectedMicrophone.value = allAudioInputDevices.value.find(
    (device) => device.deviceId === 'default'
  );
});

watch(preferredMicrophoneId, (newPreferredMicrophoneId) => {
  const newMicrophone = allAudioInputDevices.value.find(
    (mic) => mic.deviceId === newPreferredMicrophoneId
  );
  selectedMicrophone.value = newMicrophone;
});
</script>

<template>
  <div class="main-view">
    <DuckyWithSpeechBubble :on-ducky-click="toggleRecording">
      <div v-if="response">
        <MarkdownRenderer :markdown="response" />
      </div>

      <div v-else>
        <div v-if="!isRecording && !audioBlob">
          <p>1. Click me to start recording</p>
          <p>2. Click me again to stop recording</p>
        </div>

        <div v-else-if="isRecording">
          <p style="text-align: center">I'm listening!</p>
          <p style="text-align: center">Click me again to stop recording</p>
        </div>

        <div v-else-if="audioBlob">
          <p>I've saved your wonderful recording!</p>
        </div>
      </div>
    </DuckyWithSpeechBubble>

    <AudioMeter
      v-if="isRecording"
      class="audio-meter"
      :audio-level="audioLevel"
    />

    <WaveForm v-show="!isRecording && audioUrl && !response" />

    <div v-if="!isRecording && audioBlob && !response" class="controller">
      <button @click="discardRecording">Discard</button>

      <button @click="handleTranscribeAndResponse">Send to Ducky!</button>
    </div>

    <p class="change-mic" @click="showSelectMicrophone = !showSelectMicrophone">
      Change selected microphone
    </p>

    <div v-if="showSelectMicrophone">
      <div class="microphone-list">
        Microphones:
        <select v-model="preferredMicrophoneId">
          <option
            v-for="microphone in allAudioInputDevices"
            :key="microphone.deviceId"
            :value="microphone.deviceId"
            :selected="microphone.deviceId === selectedMicrophone.deviceId"
          >
            {{ microphone.label }}
          </option>
        </select>
      </div>

      <br />
    </div>

    <div class="default-mic">
      Selected Microphone:<br />
      {{ selectedMicrophone.label }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.main-view {
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

  .change-mic {
    width: fit-content;
    text-decoration: underline;
    font-size: 14px;
    margin-right: auto;
  }

  .change-mic:hover {
    cursor: pointer;
  }

  .default-mic {
    width: 100%;
  }
}
</style>
