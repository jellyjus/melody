class Room {
    constructor(socket, roomID, data) {
        this.host = socket.user;
        this.roomName = data.name;
        this.playlist = data.playlist;
        this.ID = roomID;
        this.members = [this.host];
        this.maxMembersLength = 2;
    }

    join(socket) {
        const idx = this.members.findIndex(member => member.id === socket.user.id);

        if (idx !== -1)
            throw new Error(`user ${socket.user.id} already in room ${this.ID}`);

        if (this.members.length === this.maxMembersLength)
            throw new Error(`room ${this.ID} is full`);

        this.members.push(socket.user);
        socket.join(this.ID);
    }


    leave(socket) {
        const idx = this.members.findIndex(member => member.id === socket.user.id);

        if (idx === -1)
            throw new Error(`user ${socket.user.id} not found in room ${this.ID}`);

        this.members.splice(idx, 1);
        socket.leave(this.ID);
    }

    userInRoom(socket) {
        const idx = this.members.findIndex(member => member.id === socket.user.id);
        return idx !== -1
    }

}

module.exports = Room;