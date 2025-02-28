import { ref, onUnmounted, computed } from 'vue';

const isRecording = ref(false);
const audioChunks = ref([]);
const audioLevel = ref(0);
const preferredMicrophoneId = ref('default');
const isLoading = ref(false);

const audioBlob = computed(() => {
  if (audioChunks.value.length === 0) return null;
  return new Blob(audioChunks.value, { type: 'audio/webm' });
});

const audioUrl = computed(() => {
  if (audioChunks.value.length === 0) return null;
  const waveFile = new Blob(audioChunks.value, { type: 'audio/wav' });
  return URL.createObjectURL(waveFile);
});

export function useVoiceRecording() {
  let mediaRecorder = null;
  let audioStream = null;
  let audioContext = null;
  let analyser = null;
  let animationFrame = null;
  let audio = null;

  const startRecording = async () => {
    if (isRecording.value) return;
    isRecording.value = true;
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          deviceId: preferredMicrophoneId.value,
        },
      });

      audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(audioStream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm',
      });
      audioChunks.value = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.value.push(event.data);
      };

      mediaRecorder.start(100); // Collect data in chunks every 100ms
      isRecording.value = true;

      updateAudioLevel();
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const updateAudioLevel = () => {
    if (!analyser) return;

    const volumeArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(volumeArray);

    const filteredData = volumeArray.filter((num) => num != 0);

    let rawAverage =
      volumeArray.reduce((a, b) => a + b) / filteredData.length || 1;
    const average =
      rawAverage + rawAverage * 0.2 > 255 ? 255 : rawAverage + rawAverage * 0.2;
    audioLevel.value = average / 255;
    animationFrame = requestAnimationFrame(updateAudioLevel);
  };

  const stopRecording = async () => {
    if (mediaRecorder && isRecording.value) {
      mediaRecorder.stop();
      audioStream.getTracks().forEach((track) => track.stop());
      isRecording.value = false;

      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      audioLevel.value = 0;
    }
  };

  const discardRecording = () => {
    audioChunks.value = [];
    audioLevel.value = 0;
  };

  onUnmounted(() => {
    stopRecording();
    audioStream = null;
    analyser = null;
    audioContext = null;
    animationFrame = null;
    mediaRecorder = null;
    audioChunks.value = [];
    audioLevel.value = 0;
    if (audio) {
      audio.pause();
      audio = null;
    }
  });

  return {
    isRecording,
    audioLevel,
    audioBlob,
    audioUrl,
    preferredMicrophoneId,
    isLoading,
    startRecording,
    stopRecording,
    discardRecording,
  };
}
