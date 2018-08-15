const utils = require('../../utils');

const ROOM_STATUS_LOBBY = "LOBBY";
const ROOM_STATUS_GAME = "GAME";
const HINT_INTERVAL = 3000;

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

        this._currentTrack.artistLetterGenerator = utils.getPseudoRandomLetterGenerator(this._currentTrack.artist.split(''));
        this._currentTrack.titleLetterGenerator = utils.getPseudoRandomLetterGenerator(this._currentTrack.title.split(''));

        this.currentTrackHint = {
            artist: new Array(this._currentTrack.artist.length),
            title: new Array(this._currentTrack.title.length)
        };

        socket.nsp.to(this.ID).emit('newTrack', this._currentTrack.url);

        this._hintSetInterval = setInterval(this.sendHint.bind(this, socket), HINT_INTERVAL)
    }

    sendHint(socket) {
        const artistHint = this._currentTrack.artistLetterGenerator.next();
        const titleHint = this._currentTrack.titleLetterGenerator.next();

        console.log('111', artistHint, titleHint);

        this.currentTrackHint.artist[artistHint.value.index] = artistHint.value.item;
        this.currentTrackHint.title[titleHint.value.index] = titleHint.value.item;

        console.log('@@@',this.currentTrackHint);

        socket.nsp.to(this.ID).emit('trackHint', this.currentTrackHint);
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