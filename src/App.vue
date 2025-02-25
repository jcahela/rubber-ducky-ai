
<script setup>
import { ref } from 'vue';
import RubberDucky from './components/RubberDucky/RubberDuckyIcon.vue';
import Controller from './components/Controller.vue';
import { useVoiceRecording } from './composables/useVoiceRecording';
import MinimizeIcon from './components/ui/MinimizeIcon.vue';

// State
const showController = ref(false);

const {
  isRecording
} = useVoiceRecording();

</script>

<template>
  <div class="rubber-ducky-container" :class="{ 'rubber-ducky-container-menu': showController }">

    <div class="rubber-ducky" :class="{ 'rubber-ducky-menu': showController }">
      <MinimizeIcon v-if="showController" class="minimize" @click="showController = false"/>
      <RubberDucky
        v-if="!showController"
        width="75px"
        height="75px"
        :showSpeechBubble="isRecording"
        @click="showController = true"
      />
      <Controller v-if="showController"/>
    </div>

  </div>
</template>


<style lang="postcss" scoped>

.rubber-ducky-container {
  position: fixed;
  top: 60px;
  left: -110px;
  transition: transform 0.3s ease;
  z-index: 2147483647;
  min-width: 120px;
  margin: 0;
  padding-right: 50px;
}

.rubber-ducky-container-menu {
  left: 0;
  transition: all 0.3s ease;
  position: absolute;
}

.minimize {
  position: relative;
  top: 5px;
  right: 5px;
}

.minimize:hover {
  cursor: pointer;
}

.rubber-ducky-container:hover {
  transform: translateX(85px);
}

.rubber-ducky-container-menu:hover {
  transform: translateX(0px);
}

.rubber-ducky {
  width: 100%;
  height: 100px;
  border-radius: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  border: 1px solid #afafaf;
  transition: all 0.3s ease;
}

.rubber-ducky-menu {
  height: fit-content;
  width: 400px;
  justify-content: flex-start;
  align-items: flex-end;
  flex-direction: column;
  padding: 5px;
  border-radius: 0;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  border: 1px solid #0000004c;
  border-left: none;
}

</style>
