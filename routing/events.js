const vkApi = require('./vk-api');

class Events {
    constructor(io, db, logger, config) {
        this.io = io;
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
        socket.on('createPlaylist', this.createPlaylist.bind(this, socket));
        socket.on('getPlaylists', this.getPlaylists.bind(this, socket));
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

    async createPlaylist(socket, data, cb) {
        try {
            data.author = socket.uid;
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
}

module.exports = Events;