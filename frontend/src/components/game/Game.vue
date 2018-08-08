<template>
    <div class="container">
        <Icon slot="title" size="30" type="android-close" class="leave" @click="leaveRoom"></Icon>
        <canvas id="canvas"></canvas>

        <Row class="game">
            <Col span="14" class="game-col">
                <div class="track">tracks</div>
                <div class="members" v-if="game">
                    <div class="member" v-for="member in game.members">
                        <Avatar :src="member.photo_100" class="member-avatar"/>
                        <p class="member-name">{{member.first_name}}</p>
                    </div>
                </div>
            </Col>
            <Col span="10" class="game-col">
                <div class="chat">
                    <div class="chat-container">
                        <div class="chat-container-item" v-for="message in chatMessages">
                            <Avatar :src="message.author.photo_100" class="chat-container-item-avatar"/>
                            <div class="chat-container-item-text">
                                <p>{{message.author.first_name}}</p>
                                {{message.message}}
                            </div>
                        </div>
                    </div>
                    <Input v-model="chatMessage" placeholder="Исполнитель или название трека" icon="md-send" autofocus @on-enter="sendMessage"></Input>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import audioVisualizer from "../../utils/audio-visualizer"

    export default {
        name: "Game",
        props: ['id'],
        data() {
            return {
                player: null,
                chatMessage: null,
                chatMessages: []
            }
        },
        created() {
            if (!this.game || this.game.ID !== this.id)
                this.$router.push(`/rooms`);

        },
        mounted() {
            this.player = document.getElementById('audio');
            this.chatContainer = document.querySelector(".chat-container");

            this.$socket.on('newTrack', url => {
                this.playTrack(url)
            });

            this.$socket.on('chatMessage', message => {
                this.chatMessages.push(message);
            });
        },
        updated() {
            this.chatContainer.scrollTo(0,this.chatContainer.scrollHeight);
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
            },
            sendMessage() {
                if (!this.chatMessage || !this.chatMessage.trim())
                    return;

                this.$socket.emit('chatMessage', this.chatMessage);
                this.chatMessage = null;
            }
        },
        computed: {
            game() {
                return this.$store.state.currentGame
            }
        }
    }
</script>

<style scoped lang="scss">
    $canvasHeight: 150px;
    $gameMarginTop: 50px;

    .container {
        height: 100%;
        background-image: url("../../assets/game_background.png");
        position: relative;
    }

    .game {
        height: calc(100% - #{$gameMarginTop} - #{$canvasHeight});
        margin-top: $gameMarginTop;
    }

    .game-col {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 10px;
    }

    .track, .members, .chat {
        background-color: rgba(255, 255, 255, 0.15);
        border-radius: 2px;
    }

    .members {
        display: flex;
        margin-top: auto;
        justify-content: space-around;
        padding: 7px;
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
        color: white;
        font-size: 14px;
    }

    .track {
        flex-grow: 1;
        margin-bottom: 10px;
    }

    .chat {
        height: 100%;
        padding: 5px;
        display: flex;
        flex-direction: column;
    }

    .chat-container {
        flex-grow: 1;
        margin-bottom: 5px;
        overflow-y: auto;
    }

    .chat-container::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: rgba(255, 255, 255, .8);
    }

    .chat-container::-webkit-scrollbar
    {
        width: 5px;
        background-color: rgba(255, 255, 255, .8);
    }

    .chat-container::-webkit-scrollbar-thumb
    {
        background-color: #774b55;
    }

    .chat-container-item {
        display: flex;
        margin-bottom: 5px;
    }

    .chat-container-item-avatar {
        min-width: 32px;
    }

    .chat-container-item-text {
        flex-grow: 1;
        margin-left: 5px;
        color: white;

        p {
            font-weight: 600;
            color: #d1d1d1;
        }
    }

    #canvas {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: $canvasHeight
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