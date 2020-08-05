<template>
  <div id="app">
    <Viewer />
  </div>
</template>

<script>
import Viewer from './components/Viewer.vue'

export default {
  name: 'App',
  components: {
    Viewer,
  }
}
</script>

<style lang="scss">
html, body, #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>
