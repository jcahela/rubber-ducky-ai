
<script setup>
import RubberDucky from './components/ui/RubberDucky/RubberDucky.vue'

// State

</script>

<template>
  <div class="rubber-ducky-container">

    <div class="rubber-ducky">
      <RubberDucky width="80px " height="100px"/>
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
  width: 140px;
  display: flex;
  justify-content: flex-end;
  margin: 0;
  padding-right: 20px;

  .rubber-ducky {
    width: 100px;
    height: 100px;
    border-radius: 20%;
    border: 1px solid #0000005a;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.rubber-ducky-container:hover {
  transform: translateX(110px);
}
</style>
