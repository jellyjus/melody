<template>
    <div class="container">
        <Icon slot="title" size="30" type="android-close" class="leave" @click="leaveRoom"></Icon>

        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
    import audioVisualizer from "../../utils/audio-visualizer"

    export default {
        name: "Game",
        props: ['id'],
        data() {
            return {
                player: null
            }
        },
        created() {
            if (!this.game || this.game.ID !== this.id)
                this.$router.push(`/rooms`);

        },
        mounted() {
            this.player = document.getElementById('audio');

            this.$socket.on('newTrack', url => {
                this.playTrack(url)
            });

            this.$socket.on('roomMembers', members => {
                console.log('MEMBERS', members)
            });
        },
        methods: {
            playTrack(url) {
                this.player.src = url;
                this.player.load();
                this.player.play();
                //audioVisualizer(this.player);
            },

            leaveRoom() {
                this.$socket.emit('leaveRoom', {id: this.id}, () => {
                    this.player.pause();
                    this.player.currentTime = 0;
                    this.$router.push(`/rooms`);
                })
            }
        },
        computed: {
            game() {
                return this.$store.state.currentGame
            }
        }
    }
</script>

<style scoped>
    .container {
        height: 100%;
        background-image: url("../../assets/game_background.png");
        position: relative;
    }

    #canvas {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
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
        background-color: rgba(0, 0, 0, 0.33);
    }

    .leave:hover {
        color: #c21a1e;
    }

</style>