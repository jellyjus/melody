<template>
  <div id="app">
    <Navbar></Navbar>
    <Layout class="layout">
      <router-view/>
    </Layout>

  </div>
</template>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
  }

  #app {
    width: 850px;
    height: 700px;
  }

  .layout {
    padding: 10px 10px;
    height: 100%;
    overflow-y: auto;
  }
</style>
<script>
    import Navbar from "./components/Navbar";
    export default {
        components: {Navbar}
    }
</script>