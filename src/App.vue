
<script setup>
import { ref } from 'vue';
import RubberDucky from './components/ui/RubberDucky/RubberDucky.vue';
import Menu from './components/Menu.vue';

// State
const showMenu = ref(false);

</script>

<template>
  <div class="rubber-ducky-container">

    <div class="rubber-ducky">
      <RubberDucky width="65px" @click="showMenu = !showMenu"/>
    </div>

  </div>
  <Menu v-if="showMenu"/>
</template>


<style lang="postcss" scoped>

.rubber-ducky-container {
  position: fixed;
  top: 60px;
  left: -130px;
  transition: transform 0.3s ease;
  z-index: 2147483647;
  width: 140px;
  display: flex;
  justify-content: flex-end;
  margin: 0;
  padding-right: 20px;

  .rubber-ducky {
    width: 100px;
    height: 100px;
    border-radius: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    border: 1px solid #0000005a;
  }
}

.rubber-ducky-container:hover {
  transform: translateX(110px);
}
</style>
