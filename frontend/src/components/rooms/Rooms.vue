<template>
    <div>
        <Row v-if="currentRoom">
            <h1>Ваша игра</h1>
            <Room :room="currentRoom"></Room>
        </Row>

        <Row class="rooms">
            <h1>Ожидают игры</h1>
            <Button type="primary" class="create_room" @click="createRoom">Создать игру</Button>
        </Row>
    </div>
</template>

<script>
    import Room from "./Room";
    export default {
        name: "Rooms",
        components: {Room},
        data() {
            return {
                currentRoom: null
            }
        },
        created() {
            this.$socket.emit('getRooms', null, rooms => {
                console.log('rooms: ',rooms)
                for (let key in rooms) {
                    for (let member of rooms[key].members) {
                        if (member.id === this.user.id) {
                            this.currentRoom = rooms[key];
                            break;
                        }
                    }
                }
            })
        },
        computed: {
            user() {
                return this.$store.state.user
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
    .rooms {
        margin: 10px 0;
    }

    .rooms h1 {
        float: left;
    }

    .create_room {
        float: right;
    }

</style>