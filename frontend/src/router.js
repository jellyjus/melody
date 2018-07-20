import Vue from 'vue'
import Router from 'vue-router'
import Rooms from './components/rooms/Rooms'
import CreateRoom from './components/rooms/CreateRoom'
import Playlists from './components/playlists/Playlists'
import AddPlaylist from './components/playlists/AddPlaylist'
import AlbumTracks from './components/playlists/AlbumTracks'

Vue.use(Router);

export default new Router({
  routes: [
      {
          path: '/',
          redirect: '/rooms'
      },
      {
          path: '/rooms',
          component: Rooms,
      },
      {
          path: '/create_room',
          component: CreateRoom,
      },
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
