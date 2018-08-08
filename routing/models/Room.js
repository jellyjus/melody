const utils = require('../../utils');

const ROOM_STATUS_LOBBY = "LOBBY";
const ROOM_STATUS_GAME = "GAME";

class Room {
    constructor(socket, roomID, roomName, playlist, vkApi) {
        this.host = socket.user;
        this.roomName = roomName;
        this.playlist = playlist;
        this.ID = roomID;
        this.members = [this.host];
        this.maxMembersLength = 2;
        this.status = ROOM_STATUS_LOBBY;
        this.vkApi = vkApi;
    }

    join(socket) {
        const idx = this.members.findIndex(member => member.id === socket.user.id);

        if (idx !== -1)
            throw new Error(`user ${socket.user.id} already in room ${this.ID}`);

        if (this.members.length === this.maxMembersLength)
            throw new Error(`room ${this.ID} is full`);

        this.members.push(socket.user);
        socket.join(this.ID);

        if (this.members.length === this.maxMembersLength)
            this.startGame(socket)
    }


    leave(socket) {
        const idx = this.members.findIndex(member => member.id === socket.user.id);

        if (idx === -1)
            throw new Error(`user ${socket.user.id} not found in room ${this.ID}`);

        this.members.splice(idx, 1);
        socket.leave(this.ID);
    }

    startGame(socket) {
        //TODO: ливать из hall
        this.status = ROOM_STATUS_GAME;

        socket.nsp.to(this.ID).emit('currentGame', this.getPublicRoomObject());

        this.sendNewTrack(socket)
    }

    async sendNewTrack(socket) {
        const randomTrack = utils.getRandomItem(this.playlist.tracks);
        const tracks = (await this.vkApi.getTracks(randomTrack.id)).response;

        if (!tracks[0]) {
            socket.nsp.to(this.ID).emit('error', tracks);
            return;
        }

        this.currentTrack = tracks[0];

        socket.nsp.to(this.ID).emit('newTrack', this.currentTrack.url);
    }

    userInRoom(socket) {
        const idx = this.members.findIndex(member => member.id === socket.user.id);
        return idx !== -1
    }

    getPublicRoomObject() {
        return Object.assign({}, this, {playlist: {tracks: undefined}, vkApi: undefined, currentTrack: undefined})
    }

}

module.exports = {Room, ROOM_STATUS_GAME, ROOM_STATUS_LOBBY};