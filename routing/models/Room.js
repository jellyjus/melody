class Room {
    constructor(socket, roomID, data) {
        this.host = socket.user;
        this.roomName = data.name;
        this.playlist = data.playlist;
        this.ID = roomID;
        this.members = [this.host];
    }


}

module.exports = Room;