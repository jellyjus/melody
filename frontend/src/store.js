import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentAlbum: null
  },
  mutations: {
    setCurrentAlbum(state, data) {
      state.currentAlbum = data
    }
  },
  actions: {

  }
})
