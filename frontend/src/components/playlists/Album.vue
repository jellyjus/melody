<template>
    <Col span="6" class="container" :style="{'background-image': getAvatar()}" >
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
                const url = this.data.photo? this.data.photo.photo_270 : this.data.thumbs[0].photo_270;
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
        height: 200px;
        width: 200px;
        position:relative;
        background-size: cover;
    }
    .shadow {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color:#fff;
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