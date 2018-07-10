<template>
    <div>
        <div class="room_name">
            <h2>Введите название команты</h2>
            <Input v-model="roomName" size="large" placeholder="Название комнаты"></Input>
        </div>

        <div class="playlists"></div>
        <h2>Выберите плейлист</h2>
        <Playlist v-for="p in playlists" :key="p._id"
                  :playlist="p"
                  @click.native="selectPlaylist(p)"
                    :class="{active: p._id === playlist._id}">

        </Playlist>

        <Col span="12" offset="6" class="create">
            <Button type="primary" long @click="createRoom">Создать</Button>
        </Col>

    </div>
</template>

<script>
    import Utils from '../../utils'
    import Playlist from "../playlists/Playlist";

    export default {
        name: "CreateRoom",
        components: {Playlist},
        data() {
            return {
                roomName: null,
                playlist: {},
                playlists: []
            }
        },
        created() {
            const uid = (process.env.NODE_ENV === 'development')? '96113254' : Utils.getCookie('uid');
            this.$socket.emit('getPlaylists', null, (data) => {
                this.playlists = data.map((val) => {
                    const idx = val.likes.indexOf(uid);
                    val.like = idx !== -1;
                    return val
                });
            })
        },
        methods: {
            selectPlaylist(playlist) {
                this.playlist = playlist;
                console.log(playlist)
            },
            createRoom() {
                const data = {
                    name: this.roomName,
                    playlist: this.playlist
                };
                this.$socket.emit('createRoom', data, (res) => {
                    console.log(res)
                })
            }
        }
    }
</script>

<style scoped>
    .room_name h2{
        margin-bottom: 10px;
    }

    .playlists {
        margin-top: 25px;
    }

    .active {
        background-color: rgba(0, 0, 0, 0.11) !important;
    }

    .create {
        margin-top: 20px;
    }
</style>