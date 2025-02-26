<script setup>
import { ref, onMounted, watch } from 'vue';
import { useVoiceRecording } from '../composables/useVoiceRecording';
import AudioMeter from './ui/AudioMeter.vue';
import WaveForm from './ui/WaveForm/WaveForm.vue';
import DuckyWithSpeechBubble from './RubberDucky/DuckyWithSpeechBubble.vue';
import MarkdownRenderer from './MarkdownRenderer.vue';

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

const response = ref(
  "# The Cosmic Web: The Universe's Largest Structure\n\nDid you know that the universe isn't just a random scattering of galaxies? Instead, it's organized into a vast, intricate network known as the **Cosmic Web**! 🌌\n\n## What is the Cosmic Web?\n\nThe Cosmic Web is a **large-scale structure** of the universe, consisting of:\n- **Filaments**: Long, thread-like structures made of dark matter and gas.\n- **Nodes**: Dense regions where filaments intersect, often home to galaxy clusters.\n- **Voids**: Vast, empty spaces between filaments.\n\nThis structure is often compared to a spider's web or a neural network.\n\n## How Did It Form?\n\nThe Cosmic Web formed due to the gravitational effects of **dark matter** and the expansion of the universe. Tiny fluctuations in the early universe grew over billions of years, creating this web-like pattern.\n\n### Key Facts:\n1. **Scale**: Filaments can stretch for hundreds of millions of light-years.\n2. **Dark Matter**: Makes up about **85%** of the universe's mass and holds the Cosmic Web together.\n3. **Galaxies**: Most galaxies, including our Milky Way, reside along these filaments.\n\n## Why Is It Important?\n\nThe Cosmic Web helps us understand:\n- The distribution of matter in the universe.\n- The role of dark matter and dark energy.\n- How galaxies form and evolve.\n\n> \"The Cosmic Web is the universe's blueprint, revealing the hidden architecture of everything we see.\" — *Astronomers*\n\n## Visualizing the Cosmic Web\n\nHere’s a simple representation:\n\n```\nFilament ———— Node ———— Filament\n         \\       /\n          \\     /\n           Void\n```\n\nFor more information, check out [this NASA article](https://www.nasa.gov) on the Cosmic Web.\n\n---\n\n*Remember, the universe is not just vast—it's also beautifully structured!* ✨"
);
const allAudioInputDevices = ref([]);
const selectedMicrophone = ref({});
const showSelectMicrophone = ref(false);

async function handleTranscribe() {
  if (!audioBlob.value) return;

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

    const { response: result } = await response.json();
    response.value = result;

    console.log('Response successful: ', result);
  } catch (error) {
    console.error('Response failed: ', error);
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

    <WaveForm v-show="!isRecording && audioUrl" />

    <div v-if="!isRecording && audioBlob" class="controller">
      <button @click="discardRecording">Discard</button>

      <button @click="handleTranscribe">Transcribe</button>
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
