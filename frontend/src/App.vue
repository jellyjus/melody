<template>
  <div id="app">
    <Navbar></Navbar>
    <router-view/>
  </div>
</template>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    background-color: rgb(84, 92, 100);
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 850px;
    height: 700px;
  }
</style>
<script>
    import Navbar from "./components/Navbar";
    export default {
        components: {Navbar},
        created() {

        },
        methods: {

        }
    }
</script>