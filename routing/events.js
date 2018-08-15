const vkApi = require('./vk-api');

const {Room, ROOM_STATUS_LOBBY, ROOM_STATUS_GAME} = require('./models/Room');
const auth = require('./auth');

const HALL_ROOM = 'hall';

class Events {
    constructor(io, db, logger, config) {
        this.io = io;
        this.rooms = {};
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

        socket.on('chatMessage', this.chatMessage.bind(this, socket));
    }

    disconnect() {
        this.logger.debug("socket disconnected")
    }

    isInRoom(socket) {
        for (let key in this.rooms) {
            const idx = this.rooms[key].members.findIndex(member => member.id === socket.user.id);
            if (idx === -1)
                continue;

            socket.join(this.rooms[key].ID);
            socket.roomID = this.rooms[key].ID;
            if (this.rooms[key].status === ROOM_STATUS_GAME) {
                socket.emit('currentGame', this.rooms[key].publicObject);

                if (this.rooms[key]._currentTrack)
                    socket.emit('newTrack', this.rooms[key]._currentTrack.url);
            }

            return;
        }
    }

    async getAlbums(socket, data, cb) {
        try {
            const res = await this.vkApi.getAlbums(socket.user.id);
            cb(res)
        } catch (e) {
            this.logger.error(`error on getAlbums: ${e.toString()}`);
            socket.error({error: e.toString()});
          }
    }

    async getAlbumTracks(socket, data, cb) {
        try {
            const albumId = data.albumId;
            const res = await this.vkApi.getAlbumTracks(socket.user.id, albumId);
            cb(res)
        } catch (e) {
            this.logger.error(`error on getAlbumTracks: ${e.toString()}`);
            socket.error({error: e.toString()});
        }
    }

    async addPlaylist(socket, data, cb) {
        try {
            data.author = socket.user;

            data.tracks = data.tracks.map(track => {
                if (!track.id || !track.owner_id)
                    throw new Error(`track ${track} doesn't have id or owner_id`);
                return {
                    id: `${track.owner_id}_${track.id}`,
                    artist: track.artist,
                    title: track.title
                }
            });

            this.logger.debug(`adding playlist`, data);
            const res = await this.db.playlists.add(data);
            cb(res)
        } catch (e) {
            this.logger.error(`error on createPlaylist: ${e.toString()}`);
            socket.error({error: e.toString()});
        }
    }

    async getPlaylists(socket, data, cb) {
        try {
            const res = await this.db.playlists.getAll();
            cb(res)
        } catch (e) {
            this.logger.error(`error on createPlaylist: ${e.toString()}`);
            socket.error({error: e.toString()});
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
            this.logger.error(`error on createPlaylist: ${e.toString()}`);
            socket.error({error: e.toString()});
        }
    }

    getRooms(socket, data, cb) {
        cb(this.getLobbyRooms());
        // cb(this.io.of('/').adapter.rooms)
    }

    async createRoom(socket, data, cb) {
        try {

            const room = this.userInAnyRoom(socket);
            if (room) {
                socket.error({error: `user already in room ${room.ID}`});
                return
            }

            if (!data.name || !data.playlistId) {
                socket.error({error: `room name or playlist ID required`});
                return
            }

            const roomID = `${socket.user.id}_${+new Date()}`;
            const playlists = await this.db.playlists.getById(data.playlistId);
            this.rooms[roomID] = new Room(socket, roomID, data.name, playlists[0], this.vkApi);
            socket.join(roomID);
            socket.roomID = roomID;

            cb(this.rooms[roomID]);
            this.io.to(HALL_ROOM).emit('rooms', this.getLobbyRooms());
        } catch (e) {
            this.logger.error(`error on createRoom: ${e.toString()}`);
            socket.error({error: e.toString()});
        }
    }

    joinRoom(socket, data, cb) {
        try {
            let room = this.userInAnyRoom(socket);
            if (room) {
                if (room.status === ROOM_STATUS_GAME) {
                    socket.error({error: `user already in room ${room.ID}`});
                    return
                }
                this.leaveRoom(socket, {id: room.ID}, cb)
            }

            room = this.rooms[data.id];
            if (!room) {
                socket.error({error: `room with id ${data.id} not exists`});
                return;
            }

            room.join(socket);

            this.io.to(HALL_ROOM).emit('rooms', this.getLobbyRooms());
        } catch (e) {
            this.logger.error(`error on joinRoom: ${e.toString()}`);
            socket.error({error: e.toString()});
        }
    }

    leaveRoom(socket, data, cb) {
        try {
            const room = this.rooms[data.id];
            if (!room) {
                socket.error({error: `room with id ${data.id} not exists`});
                return;
            }

            room.leave(socket);

            if(!room.members.length)
                delete this.rooms[data.id];

            if (room.status === ROOM_STATUS_LOBBY)
                this.io.to(HALL_ROOM).emit('rooms', this.getLobbyRooms());
            else {
                this.io.to(room.ID).emit('currentGame', room.publicObject);
                cb();
            }
        } catch (e) {
            this.logger.error(`error on leaveRoom: ${e.toString()}`);
            socket.error({error: e.toString()});
        }
    }

    chatMessage(socket, data, cb) {
        const message = {
            author: socket.user,
            message: data
        };

        this.io.to(socket.roomID).emit('chatMessage', message);
    }

    userInAnyRoom(socket) {
        for (let key in this.rooms)
            if (this.rooms[key].userInRoom(socket))
                return this.rooms[key];
        return false
    }

    getLobbyRooms() {
        return Object.keys(this.rooms).reduce((res, key) => {
            this.rooms[key].status === ROOM_STATUS_LOBBY? res[key] = this.rooms[key].publicObject : null;
            return res;
        }, {});
    }
}

module.exports = {Events, HALL_ROOM};