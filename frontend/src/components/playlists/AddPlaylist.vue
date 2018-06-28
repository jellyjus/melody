<template>
    <div>
        <Row>
            <Col span="12">
                <Breadcrumb>
                    <BreadcrumbItem to="/playlists">
                        <Icon type="ios-home-outline"></Icon> Плейлисты
                    </BreadcrumbItem>
                    <BreadcrumbItem to="/playlists/add_playlist">
                        <Icon type="social-buffer-outline"></Icon> Создать
                    </BreadcrumbItem>
                </Breadcrumb>
            </Col>
        </Row>
        <Row style="margin-top: 30px">
            <Input v-model="name" placeholder="Имя плейлиста" style="width: 300px"></Input>
        </Row>
        <Row type="flex" justify="space-around" style="margin-top: 20px">
            <Album v-for="album in albums" :data="album" :key="album.id"></Album>
        </Row>
    </div>
</template>

<script>
    import Album from "./Album";
    export default {
        name: "AddPlaylist",
        components: {Album},
        data() {
            return {
                name: null,
                albums: []
            }
        },
        created() {
            this.$socket.emit("getAlbums", null, (data) => {
                this.albums = data.response.items
            })
        }
    }
</script>

<style scoped>
    .header-back {
        float: right;
    }
</style>