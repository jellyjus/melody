const vkApi = require('./vk-api');

class Events {
    constructor(io, db, logger, config) {
        this.io = io;
        this.db = db;
        this.logger = logger;
        this.config = config;
        this.vkApi = new vkApi(config)
    }

    initEvents(socket) {
        const cookies = socket.request.cookies;
        this.logger.info('socket connected', cookies);
        socket.on('disconnect', this.disconnect.bind(this, socket));
        socket.on('getAlbums', this.getAlbums.bind(this, socket));
        socket.on('getAlbumTracks', this.getAlbumTracks.bind(this, socket));
        //this.getAlbums(socket, {}, (res) => {})
        const res = this.db.playlists.getAll();
        console.log("@@@@@@", res)
    }

    disconnect() {
        this.logger.debug("socket disconnected")
    }

    async getAlbums(socket, data, cb) {
        try {
            const uid = socket.request.cookies.uid;
            const res = await this.vkApi.getAlbums(uid);
            cb(res)
        } catch (e) {
            this.logger.error(`error on getAlbums: ${e}`);
            cb({error: e})
        }
    }

    async getAlbumTracks(socket, data, cb) {
        try {
            const uid = socket.request.cookies.uid;
            const albumId = data.albumId;
            const res = await this.vkApi.getAlbumTracks(uid, albumId);
            cb(res)
        } catch (e) {
            this.logger.error(`error on getAlbumTracks: ${e}`);
            cb({error: e})
        }

    }
}

module.exports = Events;