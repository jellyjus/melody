<template>
    <Card shadow class="container">
        <p slot="title">{{room.roomName}}</p>
        <p slot="title" class="subtitle">Playlist: {{room.playlist.name}} ({{room.playlist.tracks.length}} tracks)</p>
        <Icon slot="title" size="30" type="android-close" class="leave" @click="leaveRoom" v-if="isCurrentRoom"></Icon>

        <div class="members">
            <div class="member" v-for="(n, index) in room.maxMembersLength">
                <template v-if="room.members[index]">
                    <Avatar :src="room.members[index].photo_100" class="member-avatar"/>
                    <p class="member-name">{{room.members[index].first_name}}</p>
                </template>
                <template v-else>
                    <template v-if="isCurrentRoom">
                        <Avatar icon="android-more-horizontal" class="member-avatar" style="background-color: transparent"/>
                        <p class="member-name" style="color: #7b818e">Ожидание</p>
                    </template>
                    <template v-else>
                        <Avatar @click.native="joinRoom" icon="android-add" class="member-avatar" style="background-color: transparent"/>
                        <p @click="joinRoom" class="member-name" style="color: #7b818e">Присоединиться</p>
                    </template>
                </template>
            </div>
        </div>
    </Card>
</template>

<script>
    export default {
        name: "Room",
        props: ['room', 'isCurrentRoom'],
        methods: {
            leaveRoom() {
                this.$socket.emit('leaveRoom', {id: this.room.ID}, data => {
                    console.log(data)
                })
            },
            joinRoom() {
                this.$socket.emit('joinRoom', {id: this.room.ID}, data => {
                    console.log(data)
                })
            }
        }
    }
</script>

<style scoped>
    .container {
        position: relative;
    }

    .subtitle {
        color: grey;
        font-weight: 400;
    }

    .members {
        display: flex;
        justify-content: space-around;
    }

    .member {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
    }

    .member-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        line-height: 60px;
        font-size: 34px !important;
        transition: .2s;
        color: #b7c1d2;
    }

    .member-avatar:hover {
        color: #99a3b4;
    }

    .member-name {
        margin-top: 8px;
    }

    .leave {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        color: #717b8a;
        transition: .2s;
        padding: 4px 10px;
        border-radius: 50%;
    }

    .leave:hover {
        color: #c21a1e;
        background-color: #c2ccdd;;
    }
</style>