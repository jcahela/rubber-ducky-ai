import { createApp } from 'vue'
import App from './App.vue'

// Create a container for our Vue app
const container = document.createElement('div')
container.id = 'ai-rubber-ducky'
document.body.appendChild(container)

// Create and mount Vue app
const app = createApp(App)
app.mount('#ai-rubber-ducky')
