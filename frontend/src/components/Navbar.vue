<template>
    <el-menu
            :default-active="'rooms'"
            class="el-menu-demo"
            @select="handleSelect"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
        <el-menu-item index="rooms">Комнаты</el-menu-item>
        <el-menu-item index="playlists">Плейлисты</el-menu-item>
    </el-menu>
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

</style>