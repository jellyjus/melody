const vkApi = require('./vk-api');

const Room = require('./models/Room');
const auth = require('./auth');

const HALL_ROOM = 'hall';

class Events {
    constructor(io, db, logger, config) {
        this.io = io;
        this.io.rooms = {};
        this.db = db;
        this.logger = logger;
        this.config = config;
        this.vkApi = new vkApi(config);

        this.io.use(auth)
    }

    initEvents(socket) {
        this.logger.info('socket connected', socket.user);

        this.isInRoom(socket);
        socket.join(HALL_ROOM);
        socket.on('disconnect', this.disconnect.bind(this, socket));
        socket.on('getAlbums', this.getAlbums.bind(this, socket));
        socket.on('getAlbumTracks', this.getAlbumTracks.bind(this, socket));
        socket.on('addPlaylist', this.addPlaylist.bind(this, socket));
        socket.on('getPlaylists', this.getPlaylists.bind(this, socket));
        socket.on('likePlaylist', this.likePlaylist.bind(this, socket));

        socket.on('getRooms', this.getRooms.bind(this, socket));
        socket.on('createRoom', this.createRoom.bind(this, socket));
        socket.on('joinRoom', this.joinRoom.bind(this, socket));
        socket.on('leaveRoom', this.leaveRoom.bind(this, socket));
    }

    disconnect() {
        this.logger.debug("socket disconnected")
    }

    isInRoom(socket) {
        for (let key in this.io.rooms) {
            const idx = this.io.rooms[key].members.findIndex(member => member.id === socket.user.id);
            if (idx === -1)
                continue;

            socket.join(this.io.rooms[key].ID);
            return;
        }
    }

    async getAlbums(socket, data, cb) {
        try {
            const res = await this.vkApi.getAlbums(socket.user.id);
            cb(res)
        } catch (e) {
            this.logger.error(`error on getAlbums: ${e}`);
            cb({error: e})
        }
    }

    async getAlbumTracks(socket, data, cb) {
        try {
            const albumId = data.albumId;
            const res = await this.vkApi.getAlbumTracks(socket.user.id, albumId);
            cb(res)
        } catch (e) {
            this.logger.error(`error on getAlbumTracks: ${e}`);
            cb({error: e})
        }
    }

    async addPlaylist(socket, data, cb) {
        try {
            data.author = socket.user;
            this.logger.debug(`adding playlist`, data);
            const res = await this.db.playlists.add(data);
            cb(res)
        } catch (e) {
            this.logger.error(`error on createPlaylist: ${e}`);
            cb({error: e})
        }
    }

    async getPlaylists(socket, data, cb) {
        try {
            const res = await this.db.playlists.getAll();
            cb(res)
        } catch (e) {
            this.logger.error(`error on createPlaylist: ${e}`);
            cb({error: e})
        }
    }

    async likePlaylist(socket, data, cb) {
        try {
            const playlists = await this.db.playlists.getById(data._id);
            const idx = playlists[0].likes.findIndex(user => user.id === socket.user.id);

            if (idx === -1) {
                await this.db.playlists.like(data._id, socket.user);
                cb({like: true})
            } else {
                await this.db.playlists.unlike(data._id, socket.user);
                cb({like: false})
            }
        } catch (e) {
            this.logger.error(`error on createPlaylist: ${e}`);
            cb({error: e})
        }
    }

    getRooms(socket, data, cb) {
        cb(this.io.rooms);
        // cb(this.io.of('/').adapter.rooms)
    }

    createRoom(socket, data, cb) {
        try {
            const roomID = `${socket.user.id}_${+new Date()}`;
            this.io.rooms[roomID] = new Room(socket, roomID, data);
            socket.join(roomID);

            cb(this.io.rooms[roomID]);
            this.io.to(HALL_ROOM).emit('rooms', this.io.rooms);
        } catch (e) {
            this.logger.error(`error on createPlaylist: ${e}`);
            cb({error: e.toString()})
        }
    }

    joinRoom(socket, data, cb) {
        try {
            const room = this.io.rooms[data.id];
            if (!room)
                return cb({error: `room with id ${data.id} not exists`});

            if (room.userInRoom(socket))
                return cb({error: `user ${socket.user.id} already in room ${room.ID}`});

            room.join(socket);

            this.io.to(HALL_ROOM).emit('rooms', this.io.rooms);
        } catch (e) {
            this.logger.error(`error on joinRoom: ${e}`);
            cb({error: e.toString()})
        }
    }

    leaveRoom(socket, data, cb) {
        try {
            const room = this.io.rooms[data.id];
            if (!room)
                return cb({error: `room with id ${data.id} not exists`});

            room.leave(socket);

            if(!room.members.length)
                delete this.io.rooms[data.id];

            this.io.to(HALL_ROOM).emit('rooms', this.io.rooms);
        } catch (e) {
            this.logger.error(`error on leaveRoom: ${e}`);
            cb({error: e.toString()})
        }
    }

    getRoom(id) {
        return this.io.of('/').adapter.rooms[id]
    }
}

module.exports = Events;