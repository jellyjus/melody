<template>
    <Menu mode="horizontal" active-name="rooms" @on-select="handleSelect">
        <MenuItem name="/rooms">
            <Icon type="ios-paper"></Icon>
            Комнаты
        </MenuItem>
        <MenuItem name="/playlists">
            <Icon type="ios-people"></Icon>
            Плейлисты
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