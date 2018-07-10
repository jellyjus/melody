const vkApi = require('./vk-api');

const Room = require('./models/Room');

class Events {
    constructor(io, db, logger, config) {
        this.io = io;
        this.io.rooms = {};
        this.db = db;
        this.logger = logger;
        this.config = config;
        this.vkApi = new vkApi(config);

        this.io.use((socket, next) => {
            socket.uid = process.env.NODE_ENV === 'dev'? '96113254' : socket.request.cookies.uid;
            next()
        })
    }

    initEvents(socket) {
        const cookies = socket.request.cookies;
        this.logger.info('socket connected', cookies);
        socket.on('disconnect', this.disconnect.bind(this, socket));
        socket.on('getAlbums', this.getAlbums.bind(this, socket));
        socket.on('getAlbumTracks', this.getAlbumTracks.bind(this, socket));
        socket.on('addPlaylist', this.addPlaylist.bind(this, socket));
        socket.on('getPlaylists', this.getPlaylists.bind(this, socket));
        socket.on('likePlaylist', this.likePlaylist.bind(this, socket));

        socket.on('createRoom', this.createRoom.bind(this, socket))
    }

    disconnect() {
        this.logger.debug("socket disconnected")
    }

    async getAlbums(socket, data, cb) {
        try {
            const res = await this.vkApi.getAlbums(socket.uid);
            cb(res)
        } catch (e) {
            this.logger.error(`error on getAlbums: ${e}`);
            cb({error: e})
        }
    }

    async getAlbumTracks(socket, data, cb) {
        try {
            const albumId = data.albumId;
            const res = await this.vkApi.getAlbumTracks(socket.uid, albumId);
            cb(res)
        } catch (e) {
            this.logger.error(`error on getAlbumTracks: ${e}`);
            cb({error: e})
        }
    }

    async addPlaylist(socket, data, cb) {
        try {
            data.author = socket.uid;
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
            const idx = playlists[0].likes.indexOf(socket.uid);

            if (idx === -1) {
                await this.db.playlists.like(data._id, socket.uid);
                cb({like: true})
            } else {
                await this.db.playlists.unlike(data._id, socket.uid);
                cb({like: false})
            }
        } catch (e) {
            this.logger.error(`error on createPlaylist: ${e}`);
            cb({error: e})
        }
    }

    createRoom(socket, data, cb) {
        try {
            const roomID = `${socket.uid}_${+new Date()}`;
            socket.join(roomID);
            const room = this.getRoom(roomID);
            room.settings = new Room(socket, roomID, data);
            cb(room)
        } catch (e) {
            this.logger.error(`error on createPlaylist: ${e}`);
            cb({error: e.toString()})
        }
    }

    getRoom(id) {
        return this.io.of('/').adapter.rooms[id]
    }
}

module.exports = Events;