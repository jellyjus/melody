class Room {
    constructor(socket, roomID, data) {
        this.host = socket.uid;
        this.roomName = data.name;
        this.playlist = data.playlist;
        this.ID = roomID;
    }

    get members() {
        //return this.io.of('/').adapter.rooms[this.ID]
    }
}

module.exports = Room;