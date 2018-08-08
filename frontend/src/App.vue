<template>
  <div id="app">

    <audio id="audio" controls ref="player" crossorigin="anonymous"></audio>

    <Navbar></Navbar>
    <Layout class="layout">
      <keep-alive include="Game">
        <router-view/>
      </keep-alive>
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

  #audio {
    display: none;
  }
</style>
<script>
    import Navbar from "./components/Navbar";
    export default {
        components: {Navbar},
        created() {
            this.$http.get('/login').then(res => {
                if(!res.data.id)
                    return console.log("Login error", res.data);

                this.$store.commit('setUser', res.data);
                this.$socket.open();
            });

            this.$socket.on('error', res => {
                console.log("ERROR", res)
            })
        }
    }
</script>