<template>
    <div>
        <Row>
            <Col span="24" class="track back" @click.native="back">
                <div class="action back">
                    <Icon type="more" size="24"></Icon>
                </div>
            </Col>
        </Row>
        <Row v-for="track in tracks" :key="track.id">
            <Col span="24" class="track" @click.native="addOrDeleteTrack(track)">
                <div class="action">
                    <div v-if="!isAddedTrack(track.id)">
                        <img src="https://vk.com/images/audio_row_placeholder.png">
                        <Icon type="plus-round" size="24" color="#2b85e4" class="action-add"></Icon>
                    </div>
                    <div v-else>
                        <Icon type="checkmark" size="20" color="green" class="action-success"></Icon>
                        <Icon type="close-round" size="20" class="action-delete"></Icon>
                    </div>
                </div>
                <div class="author">{{track.artist}}</div>
                <div class="name">{{track.title}}</div>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "PlaylistTracks",
        props: ['id'],
        data() {
            return {
                tracks: []
            }
        },
        created() {
            this.$socket.emit('getAlbumTracks', {albumId: this.id}, (data) => {
                this.tracks = data.response.items;
                console.log(this.tracks)
            })
        },
        methods: {
            addOrDeleteTrack(track) {
                this.$store.commit('addOrDeleteTrack', track)
            },
            isAddedTrack(id) {
                const idx =  this.addedTracks.findIndex(obj => obj.id === id);
                return idx !== -1;
            },
            back() {
                this.$router.push(`/add_playlist`)
            }
        },
        computed: {
            addedTracks() {
                return this.$store.state.addedTracks
            }
        }
    }
</script>

<style scoped>
    .back {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 10px;
    }

    .track {
        margin: 3px 0;
        padding: 5px;
        border-radius: 3px;
    }

    .track:hover {
        background-color: rgba(0, 0, 0, 0.05);
        cursor: pointer;
    }

    .track:hover img{
        opacity: 0;
    }

    .track:hover .action-success{
        opacity: 0;
    }

    .track:hover .action-add{
        opacity: 1;
    }

    .track:hover .action-delete{
        opacity: 1;
    }

    .action-add, .action-success, .action-delete {
        position: absolute;
        left: 11px;
        top: 8px;
    }

    .action-add {
        opacity: 0;
    }

    .action-delete {
        opacity: 0;
    }

    .action {
        position: relative;
        margin-right: 10px;
        float: left;
        border-radius: 3px;
        width: 40px;
        height: 40px;
    }

    .author {
        font-weight: 500;
    }
</style>