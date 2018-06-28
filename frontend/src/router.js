import Vue from 'vue'
import Router from 'vue-router'
import Playlists from './components/playlists/Playlists'
import AddPlaylist from './components/playlists/AddPlaylist'
import AlbumTracks from './components/playlists/AlbumTracks'

Vue.use(Router);

export default new Router({
  routes: [
      {
          path: '/playlists',
          component: Playlists,
      },
      {
          path: '/add_playlist',
          component: AddPlaylist,
      },
      {
          path: '/add_playlist/:id',
          component: AlbumTracks,
          props: true
      },
  ]
})
