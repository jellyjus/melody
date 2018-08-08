<template>
    <Menu mode="horizontal" active-name="rooms" @on-select="handleSelect">
        <MenuItem name="/rooms">
            Комнаты
        </MenuItem>
        <MenuItem name="/playlists">
            Плейлисты
        </MenuItem>
        <MenuItem :name="'/game' + currentGame.ID" v-if="currentGame">
            <Icon type="music-note"></Icon>
            {{currentGame.roomName}}
        </MenuItem>

        <Avatar v-if="user" :src="user.photo_100" class="avatar" size="large"/>
    </Menu>
</template>

<script>
    export default {
        name: "Navbar",
        methods: {
            handleSelect(key) {
                this.$router.push(key)
            }
        },
        computed: {
            user() {
                return this.$store.state.user
            },
            currentGame() {
                return this.$store.state.currentGame
            }
        }
    }
</script>

<style scoped>
    .el-menu-demo {
        border-bottom: none;
    }

    .avatar {
       float: right;
        margin: 10px 10px;
    }
</style>