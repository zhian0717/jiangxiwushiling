<template>
  <div id="app">
    <!-- <milestone /> -->
    <worklistWH/>
  </div>
</template>

<script>
// import milestone from './components/milestone.vue'
import worklistWH from './components/worklistWH.vue'


export default {
  name: 'app',
  components: {
    // milestone
    worklistWH
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
