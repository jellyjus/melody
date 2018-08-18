<template>
    <Row class="playlist">
        <Col span="16">
            <img src="../../assets/playlist.png">
            <div class="playlist-name">{{playlist.name}}</div>
            <!--<div class="playlist-tracks">Треков: {{playlist.tracks.length}}</div>-->
        </Col>
        <Col span="8" class="playlist-additional">
            <Col span="16" class="playlist-additional-author">
                <Icon type="person" size="23"></Icon> {{playlist.author.first_name}} {{playlist.author.last_name}}
            </Col>
            <div class="playlist-additional-likes">
                <Icon type="android-favorite-outline" size="23" @click="likePlaylist(playlist)" v-if="!playlist.like" class="playlist-additional-likes-empty"></Icon>
                <Icon type="android-favorite" size="23" @click="likePlaylist(playlist)" v-else class="playlist-additional-likes-fill"></Icon>
                {{playlist.likes.length}}
            </div>
        </Col>
    </Row>
</template>

<script>
    export default {
        name: "Playlist",
        props: ['playlist'],
        methods: {
            likePlaylist(playlist) {
                this.$socket.emit('likePlaylist', playlist, (data) => {
                    playlist.like = data.like;
                })
            }
        }
    }
</script>

<style scoped>
    .playlist {
        margin: 6px 0;
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
        margin-left: 20px;
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
        color: #e1e1e1;
    }
</style>