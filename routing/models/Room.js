const utils = require('../../utils');

const ROOM_STATUS_LOBBY = "LOBBY";
const ROOM_STATUS_GAME = "GAME";
const HINT_INTERVAL = 4000;
const HINT_FIRST_TIMEOUT = 3000;

class Room {
    constructor(socket, roomID, roomName, playlist, vkApi) {
        this.host = socket.user;
        this.roomName = roomName;
        this.playlist = playlist;
        this.ID = roomID;
        this.members = [this.host];
        this.maxMembersLength = 2;
        this.status = ROOM_STATUS_LOBBY;
        this._vkApi = vkApi;
    }

    join(socket) {
        const idx = this.members.findIndex(member => member.id === socket.user.id);

        if (idx !== -1)
            throw new Error(`user ${socket.user.id} already in room ${this.ID}`);

        if (this.members.length === this.maxMembersLength)
            throw new Error(`room ${this.ID} is full`);

        this.members.push(socket.user);
        socket.join(this.ID);
        socket.roomID = this.ID;

        if (this.members.length === this.maxMembersLength)
            this.startGame(socket)
    }


    leave(socket) {
        const idx = this.members.findIndex(member => member.id === socket.user.id);

        if (idx === -1)
            throw new Error(`user ${socket.user.id} not found in room ${this.ID}`);

        this.members.splice(idx, 1);
        socket.leave(this.ID);
        delete socket.roomID;
    }

    startGame(socket) {
        //TODO: ливать из hall
        this.status = ROOM_STATUS_GAME;

        socket.nsp.to(this.ID).emit('currentGame', this.publicObject);

        this.sendNewTrack(socket)
    }

    async sendNewTrack(socket) {
        const randomTrack = utils.getRandomItem(this.playlist.tracks);
        const tracks = (await this._vkApi.getTracks(randomTrack.id)).response;

        if (!tracks[0]) {
            socket.nsp.to(this.ID).emit('error', tracks);
            return;
        }

        this._currentTrack = {
            url: tracks[0].url,
            artist: randomTrack.artist,
            title: randomTrack.title
        };

        console.log('NEW TRACK', this._currentTrack);

        this._currentTrack.artistLetterGenerator = utils.getPseudoRandomLetterGenerator(this._currentTrack.artist);
        this._currentTrack.titleLetterGenerator = utils.getPseudoRandomLetterGenerator(this._currentTrack.title);

        this.currentTrackHint = {
            artist: Array(this._currentTrack.artist.length),
            title: Array(this._currentTrack.title.length)
        };

        socket.nsp.to(this.ID).emit('newTrack', this._currentTrack.url);
        socket.nsp.to(this.ID).emit('trackHint', this.currentTrackHint);

        this._hintSetTimeout = setTimeout(this.sendHint.bind(this, socket), HINT_INTERVAL + HINT_FIRST_TIMEOUT)
    }

    sendHint(socket) {
        const artistHint = this._currentTrack.artistLetterGenerator.next();
        const titleHint = this._currentTrack.titleLetterGenerator.next();

        this.currentTrackHint.artist[artistHint.value.index] = artistHint.value.item;
        this.currentTrackHint.title[titleHint.value.index] = titleHint.value.item;

        socket.nsp.to(this.ID).emit('trackHint', this.currentTrackHint);

        if (artistHint.done || titleHint.done) {
            clearTimeout(this._hintSetTimeout);
            setTimeout(this.sendNewTrack.bind(this, socket), HINT_INTERVAL);
            return;
        }

        this._hintSetTimeout = setTimeout(this.sendHint.bind(this, socket), HINT_INTERVAL)
    }

    isGameWinner(socket, message) {
        message = message.trim().toLowerCase();

        if (message.indexOf(this._currentTrack.artist.toLowerCase()) !== -1 || message.indexOf(this._currentTrack.title.toLowerCase()) !== -1) {
            clearTimeout(this._hintSetTimeout);
            this.currentTrackHint = {
                artist: this._currentTrack.artist.split(''),
                title: this._currentTrack.title.split('')
            };
            socket.nsp.to(this.ID).emit('chatNotification', {user: socket.user, notification: "угадывает трек!"});
            socket.nsp.to(this.ID).emit('trackHint', this.currentTrackHint);

            setTimeout(this.sendNewTrack.bind(this, socket), HINT_INTERVAL);
        }
    }


    userInRoom(socket) {
        const idx = this.members.findIndex(member => member.id === socket.user.id);
        return idx !== -1
    }

    get publicObject() {
        let internalProps = {};

        for (let key in this)
            if (key.startsWith('_'))
                internalProps[key] = undefined;

        return Object.assign({}, this, internalProps)
        //return Object.assign({}, this, {playlist: {tracks: undefined}, vkApi: undefined, currentTrack: undefined})
    }

}

module.exports = {Room, ROOM_STATUS_GAME, ROOM_STATUS_LOBBY};