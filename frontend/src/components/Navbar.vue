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
    </Menu>
</template>

<script>
    export default {
        name: "Navbar",
        created() {

        },
        methods: {
            handleSelect(key) {
                this.$router.push(key)
            }
        }
    }
</script>

<style scoped>
    .el-menu-demo {
        border-bottom: none;
    }
</style>