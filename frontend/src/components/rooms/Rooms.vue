<template>
    <div>
        <Row class="rooms">
            <h1>Ваша игра</h1>
        </Row>

        <Row class="header">
            <h1>Ожидают игры</h1>
            <Button type="primary" class="create_room" @click="createRoom">Создать игру</Button>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "Rooms",
        data() {
            return {

            }
        },
        methods: {
            createRoom() {
                this.$router.push('/create_room')
            }
        }
    }
</script>

<style scoped>
    .header {
        margin: 10px 0;
    }

    .header h1 {
        float: left;
    }

    .create_room {
        float: right;
    }

</style>