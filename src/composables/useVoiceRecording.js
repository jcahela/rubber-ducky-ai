import { ref } from 'vue'

export function useVoiceRecording() {
    const isRecording = ref(false)
    const audioChunks = ref([])
    let mediaRecorder = null
    let audioStream = null

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
            
            mediaRecorder = new MediaRecorder(audioStream)
            audioChunks.value = []

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.value.push(event.data)
                console.log('Audio chunk received:', event.data.size, 'bytes')
            }

            mediaRecorder.start(100) // Collect data in chunks every 100ms
            isRecording.value = true
            console.log('Recording started')
        } catch (err) {
            console.error('Error starting recording:', err)
        }
    }

    const stopRecording = () => {
        if (mediaRecorder && isRecording.value) {
            mediaRecorder.stop()
            audioStream.getTracks().forEach(track => track.stop())
            isRecording.value = false
            console.log('Recording stopped')
        }
    }

    const getAudioBlob = () => {
        if (audioChunks.value.length === 0) return null
        return new Blob(audioChunks.value, { type: 'audio/webm' })
    }

    return {
        isRecording,
        startRecording,
        stopRecording,
        getAudioBlob
    }
}
