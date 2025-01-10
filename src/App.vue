
<script setup>
import { ref } from 'vue';
import RubberDucky from './components/ui/RubberDucky/RubberDucky.vue';
import Menu from './components/Menu.vue';

// State
const showMenu = ref(false);

</script>

<template>
  <div class="rubber-ducky-container" :class="{ 'rubber-ducky-container-menu': showMenu }">

    <div class="rubber-ducky" :class="{ 'rubber-ducky-menu': showMenu }">
      <RubberDucky
        width="65px"
        height="65px"
        :backgroundColor="showMenu ? 'transparent' : '#FFFFFF'"
        @click="showMenu = !showMenu"
      />
      <Menu v-if="showMenu"/>
    </div>

  </div>
</template>


<style lang="postcss" scoped>

.rubber-ducky-container {
  position: fixed;
  top: 60px;
  left: -130px;
  transition: transform 0.3s ease;
  z-index: 2147483647;
  min-width: 140px;
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
    transition: all 0.3s ease;
  }

  .rubber-ducky-menu {
    height: 500px;
    width: 400px;
    border-radius: 10px;
    justify-content: flex-start;
    align-items: flex-end;
    flex-direction: column;
    padding: 5px;
  }
}

.rubber-ducky-container:hover {
  transform: translateX(110px);
}

.rubber-ducky-container-menu {
  left: 0;
}

.rubber-ducky-container-menu:hover {
  transform: translateX(0px);
}
</style>
