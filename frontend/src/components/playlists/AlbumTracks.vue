<template>
    
</template>

<script>
    export default {
        name: "PlaylistTracks",
        props: ['id'],
        created() {
            this.$socket.emit('getAlbumTracks', {albumId: this.id}, function (data) {
                console.log('@@@@@@', data)
            })
        }
    }
</script>

<style scoped>

</style>