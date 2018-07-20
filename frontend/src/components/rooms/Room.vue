<template>
    <Card shadow>
        <p slot="title">{{room.roomName}}</p>
        <p slot="title" class="subtitle">Playlist: {{room.playlist.name}} ({{room.playlist.tracks.length}} tracks)</p>

        <div class="members">
            <div class="member" v-for="member in room.members">
                <Avatar :src="member.photo_50" class="member-avatar"/>
                <p>{{member.first_name}} {{member.last_name}}</p>
            </div>
        </div>
    </Card>
</template>

<script>
    export default {
        name: "Room",
        props: ['room'],
    }
</script>

<style scoped>
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
    }

    .member-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
</style>