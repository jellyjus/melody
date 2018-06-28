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
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "Playlists",
        created() {
            this.$socket.emit('getPlaylists', null, function (data) {
                console.log('@@@@@@', data)
            })
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