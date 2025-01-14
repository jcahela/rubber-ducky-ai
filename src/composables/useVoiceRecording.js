import { ref, onUnmounted } from 'vue'

export function useVoiceRecording() {
    const isRecording = ref(false)
    const audioChunks = ref([])
    const audioLevel = ref(0);
    let mediaRecorder = null
    let audioStream = null
    let audioContext = null
    let analyser = null
    let animationFrame = null

    const startRecording = async () => {
        if (isRecording.value) return
        isRecording.value = true;
        try {
            audioStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1
                }
            })

            audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(audioStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            
            mediaRecorder = new MediaRecorder(audioStream)
            audioChunks.value = []

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.value.push(event.data)
            }

            mediaRecorder.start(100) // Collect data in chunks every 100ms
            isRecording.value = true
            console.log('Recording started')

            updateAudioLevel();
        } catch (err) {
            console.error('Error starting recording:', err)
        }
    }

    const updateAudioLevel = () => {
        if (!analyser) return
        
        const volumeArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(volumeArray)

        const filteredData = volumeArray.filter((num) => num != 0);

        let rawAverage = volumeArray.reduce((a, b) => a + b) / filteredData.length || 1;
        const average = rawAverage + (rawAverage * 0.2) > 255 ? 255 : rawAverage + (rawAverage * 0.2) 
        console.log(average);
        audioLevel.value = average / 255;        
        animationFrame = requestAnimationFrame(updateAudioLevel)
    }

    const stopRecording = () => {
        if (mediaRecorder && isRecording.value) {
            mediaRecorder.stop()
            audioStream.getTracks().forEach(track => track.stop())
            isRecording.value = false
            
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

    const getAudioBlob = () => {
        if (audioChunks.value.length === 0) return null
        return new Blob(audioChunks.value, { type: 'audio/webm' })
    }

    const playbackRecording = () => {
        const audio = new Audio(URL.createObjectURL(getAudioBlob()));
        audio.play();
        updateAudioLevel();
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
    })

    return {
        isRecording,
        audioLevel,
        startRecording,
        stopRecording,
        getAudioBlob,
        discardRecording,
        playbackRecording
    }
}
