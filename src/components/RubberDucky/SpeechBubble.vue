<template>
  <div class="speech-bubble">
    <div class="content">
      <slot>
        <p style="text-align: center">Hi! I'm ducky!</p>
        <p style="text-align: center">I'm ready to listen!</p>
      </slot>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.speech-bubble {
  position: relative;
  background: #fff;
  border: 1px solid #000;
  border-radius: 5px;
  padding: 15px;
  min-width: 200px;
  margin: 20px;
  margin-bottom: 10px;
  max-height: 40vh;
  display: flex;
  flex-direction: column;

  .content {
    overflow-y: auto;
    height: 100%;
    padding-right: 10px;
  }
}

.speech-bubble::before {
  content: '';
  position: absolute;
  left: 35%;
  bottom: -21px;
  transform: translateY(-50%) rotate(45deg);
  width: 20px;
  height: 20px;
  background: #fff;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  box-sizing: border-box;
}
</style>
