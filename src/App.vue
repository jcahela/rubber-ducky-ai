
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
        width="75px"
        height="75px"
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
  height: 500px;
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
