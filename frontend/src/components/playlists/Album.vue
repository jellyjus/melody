<template>
    <Col class="container" :style="{'background-image': getAvatar()}" >
        <div class="shadow" @click="showAlbumTracks">
            {{data.title}}
        </div>
    </Col>
</template>

<script>
    export default {
        name: "Album",
        props: ['data'],
        methods: {
            getAvatar() {
                const url = this.data.photo? this.data.photo.photo_270
                    : this.data.thumbs? this.data.thumbs[0].photo_270
                        : 'https://cdn4.iconfinder.com/data/icons/for-your-interface-part-5/128/Playlist-512.png';
                return `url("${url}")`
            },
            showAlbumTracks() {
                this.$router.push(`add_playlist/${this.data.id}`)
            }
        }
    }
</script>

<style scoped>
    .container {
        height: 180px;
        width: 180px;
        position:relative;
        background-size: cover;
        margin: 5px;
    }
    .shadow {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color:#fff;
        text-align: center;
        font-size: 22px;
        background:rgba(0,0,0,0.6);
        transition: all 0.3s;
        -webkit-transition: all 0.3s;
        opacity: 0;
    }

    .shadow:hover {
        opacity:1;
        cursor: pointer;
    }
</style>