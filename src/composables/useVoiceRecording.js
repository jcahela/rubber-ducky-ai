import { ref, onUnmounted, computed } from 'vue'

const isRecording = ref(false);
const audioChunks = ref([]);
const audioLevel = ref(0);

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
        if (isRecording.value) return
        isRecording.value = true;
        try {
            // Hard code preferred mic for now
            // TODO: allow user microphone selection
            const preferredMicrophoneId = '087fe23d3002899822038ff44b1797618e2e7363e89374c175b28ca04b901119';
            audioStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    deviceId: preferredMicrophoneId
                }
            });

            audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(audioStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            
            mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm'});
            audioChunks.value = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.value.push(event.data);
            }

            mediaRecorder.start(100); // Collect data in chunks every 100ms
            isRecording.value = true;

            updateAudioLevel();
        } catch (err) {
            console.error('Error starting recording:', err);
        }
    }

    const updateAudioLevel = () => {
        if (!analyser) return
        
        const volumeArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(volumeArray);

        const filteredData = volumeArray.filter((num) => num != 0);

        let rawAverage = volumeArray.reduce((a, b) => a + b) / filteredData.length || 1;
        const average = Math.min(255, rawAverage);

        const MIN_THRESHOLD = 50;  // Typical background noise level
        const MAX_THRESHOLD = 130; // Typical max level observed
        
        audioLevel.value = Math.max(0, Math.min(1, (average - MIN_THRESHOLD) / (MAX_THRESHOLD - MIN_THRESHOLD)));     
        animationFrame = requestAnimationFrame(updateAudioLevel);
    }

    const stopRecording = async () => {
        if (mediaRecorder && isRecording.value) {
            mediaRecorder.stop();
            audioStream.getTracks().forEach(track => track.stop());
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
    }

    const discardRecording = () => {
        audioChunks.value = [];
        audioLevel.value = 0;
    }

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
    })

    return {
        isRecording,
        audioLevel,
        audioBlob,
        audioUrl,
        startRecording,
        stopRecording,
        discardRecording
    }
}
