<p align="center">
  <img src="src/assets/demo/rubber-duck-icon.png" alt="Logo" width="90" height="90">
  <h1 align="center">Rubber Ducky AI</h1>
  <p align="center">
    An LLM-powered rubber duck debugging tool for developers
    <br />
    <br />
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary id="table-of-contents">Table of Contents</summary>
  <ol>
    <li>
      <a href="#installation-instructions">Installation Instructions</a>
    </li>
    <li>
      <a href="#workflow-overview">Workflow Overview</a>
    </li>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#how-to-use">How to use</a>
      <ol>
        <li><a href="#1-open-slider">Open slider</a></li>
        <li><a href="#2-record">Record yourself brainstorming</a></li>
        <li><a href="#3-playback">Playback your recording</a></li>
        <li><a href="#4-submit--response">Submit and LLM-powered ducky will respond</a></li>
      </ol>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project
[Back to top](#table-of-contents)

<p>Built With:</p>
<ul>
  <li>Vue frontend</li>
  <li>Media Recorder API</li>
  <li>Custom microphone audio visualization</li>
  <li>Wavesurfer integration for audio playback and visualization</li>
  <li>Mermaid diagram integration</li>
  <li>Express backend</li>
  <li>OpenAI API Transcription Model integration</li>
  <li>OpenAI API Completion Model integration</li>
</ul>

### Description

Rubber Ducky AI is built as a Chrome Extension to be overlayed onto any website the developer is currently viewing. It slides out on click and allows users to record audio of themselves brainstorming and debugging. Once done, users can playback the audio and send it to ducky. Using the power of LLMs, ducky will respond with a well-laid-out mermaid diagram to assist the developer in their debugging journey. Just like the rubber duck debugging method, except this duck talks back!

## Installation Instructions
[Back to top](#table-of-contents)

1. Clone repo locally
2. From the terminal, go to the root folder and run:

  ```
  npm install
  ```

3. Go to the backend folder, and run:

  ```
  npm install
  ```

4. Login to the [Open AI API website](platform.openai.com) and click Dashboard

5. Go to API keys and create a new secret key (make sure to allow all permissions)

6. Buy credits for token usage attached to your Open AI account

7. Create a file named **".env"** in the root folder

8. Enter the following and save:
```
OPENAI_API_KEY=<Your Open AI API Key Here>
```

9. Once the above is setup, run the frontend with
```
npm run front-serve
```
10. And the backend with:
```
npm run back-serve
```

## Workflow Overview
[Back to top](#table-of-contents)

![Workflow Overview](src/assets/demo/app-sequence.jpeg)

## How to use

### 1. Open Slider
[Back to top](#table-of-contents)

![Open Slider](src/assets/demo/1-open-slider.gif)

### 2. Record
[Back to top](#table-of-contents)

![Record](src/assets/demo/2-record-audio.gif)

### 3. Playback
[Back to top](#table-of-contents)

![Playback](src/assets/demo/3-playback-recording.gif)

### 4. Submit & Response
[Back to top](#table-of-contents)

![Submit Recording](src/assets/demo/4-receive-response.gif)

<!-- CONTACT -->
## Contact
[Back to top](#table-of-contents)

Jason Cahela:
 - LinkedIn: https://www.linkedin.com/in/jason-cahela/
 - Email: jpacahela@gmail.com
