<template>
    <div>
        <Row>
            <Col span="12">
                <Breadcrumb>
                    <BreadcrumbItem to="/playlists">
                        <Icon type="ios-home-outline"></Icon> Плейлисты
                    </BreadcrumbItem>
                </Breadcrumb>
            </Col>
            <Col span="12">
                <Button type="primary" icon="plus" class="header-add" @click="addPlaylist">Добавить</Button>
            </Col>
        </Row>

        <Row v-for="playlist in playlists" :key="playlist._id" class="playlist">
            <Col span="16">
                <img src="../../assets/playlist.png">
                <div class="playlist-name">{{playlist.name}}</div>
                <div class="playlist-tracks">Треков: {{playlist.tracks.length}}</div>
            </Col>
            <Col span="8" class="playlist-additional">
                <div class="playlist-additional-likes">
                    <Icon type="android-favorite-outline" size="23" @click="likePlaylist(playlist)" v-if="!playlist.like" class="playlist-additional-likes-empty"></Icon>
                    <Icon type="android-favorite" size="23" @click="likePlaylist(playlist)" v-else class="playlist-additional-likes-fill"></Icon>
                    {{playlist.likes.length}}
                </div>
                <div class="playlist-additional-author">
                    <Icon type="person" size="23"></Icon> {{playlist.author}}
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import Utils from '../../utils'

    export default {
        name: "Playlists",
        data() {
            return {
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
            addPlaylist() {
                this.$router.push('add_playlist')
            },
            likePlaylist(playlist) {
                this.$socket.emit('likePlaylist', playlist, (data) => {
                    playlist.like = data.like
                })
            }
        }
    }
</script>

<style scoped>
    .playlist {
        margin: 3px 0;
        padding: 5px;
        border-radius: 3px;
    }

    .playlist:hover {
        background-color: rgba(0, 0, 0, 0.05);
        cursor: pointer;
    }

    .playlist img {
        float: left;
        margin-right: 7px;
        width: 50px;
    }

    .playlist-name {
        font-weight: 500;
        font-size: 14px;
    }

    .playlist-additional {
        min-height: 50px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
    }

    .playlist-additional-likes {
        margin-right: 30px;
        font-size: 16px;
        font-weight: 500;
    }

    .playlist-additional-likes i {
        transition: .1s;
    }

    .playlist-additional-likes i:active {
        transform: scale(1.2)
    }

    .playlist-additional-likes-empty:hover {
        color: #4972ff;
    }

    .playlist-additional-likes-fill {
        color: #ff3948;
    }

    .playlist-additional-author {
        font-size: 13px;
        color: grey;
    }

    .header-add {
        float: right;
    }
</style>