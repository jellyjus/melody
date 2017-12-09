const audioPlayer = new ya.music.Audio();
audioPlayer.initPromise().then(() => {
    console.log("Аудио-плеер готов к работе");
}, () => {
    console.error("Не удалось инициализировать аудио-плеер");
});

const app = new Vue({
    el: '#app',
    data: {
        mode: null,
        socket: null,
        userName: null,
        players: [],
        messages: [],
        message: '',
        emotes: []
    },
    created() {
        this.socket = io();

        this.socket.on('game_started', this.gameStarted);
        this.socket.on('new_message', this.onNewMessage);
        this.socket.on('win_game', this.onWinGame);

        this.getEmotes();
    },
    methods: {
        getEmotes() {
            fetch('/emotes.json')
                .then(res => res.json())
                .then(emotes => this.emotes = emotes)
        },
        findGame() {
            this.mode = 'search';
            this.socket.emit('game_search', this.userName);
        },
        gameStarted(players) {
            console.log('GAME STARTED');
            this.mode = 'game';
            this.players = players;
            audioPlayer.play('/get_song');
        },
        sendMessage(e) {
            if (!this.message)
                return;

            this.socket.emit('send_message', this.message);
            this.message = '';
        },
        onNewMessage(message) {
            message.html = `${message.userName}: ${message.text}`;
            this.messages.push(message)
        },
        onWinGame(message) {
            message.html = `${message.userName}: ${message.text}`;
            this.messages.push({...message, win: true});
            audioPlayer.stop();
            audioPlayer.play('/get_song');
        },
        changeVolume(e) {
            const volume = +e.target.value / 100;
            audioPlayer.setVolume(volume);
        },
        addEmote(emote) {
            this.message += ` ${emote.code} `
        }
    }
});