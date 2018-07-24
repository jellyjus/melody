import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    addedTracks: [],
    rooms: {}
  },
  mutations: {
      addOrDeleteTrack(state, track) {
          const idx =  state.addedTracks.findIndex(obj => obj.id === track.id);
          idx !== -1 ? state.addedTracks.splice(idx, 1) : state.addedTracks.push(track);
      },
      setUser(state, user) {
          state.user = user;
      },
      rooms(state, rooms) {
          state.rooms = rooms;
      }
  },
  actions: {

  }
})
