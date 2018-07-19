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

        <Playlist v-for="playlist in playlists" :key="playlist._id" :playlist="playlist"></Playlist>
    </div>
</template>
<script>
    import Playlist from "./Playlist";

    export default {
        name: "Playlists",
        components: {Playlist},
        data() {
            return {
                playlists: []
            }
        },
        created() {
            this.$socket.emit('getPlaylists', null, (data) => {
                this.playlists = data.map((val) => {
                    const idx = val.likes.findIndex(user => user.id === this.user.id);
                    val.like = idx !== -1;
                    return val
                });
            })
        },
        computed: {
            user() {
                return this.$store.state.user
            }
        },
        methods: {
            addPlaylist() {
                this.$router.push('add_playlist')
            }
        }
    }
</script>

<style scoped>

    .header-add {
        float: right;
    }
</style>