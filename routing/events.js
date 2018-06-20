const vkApi = require('./vk-api');

class Events {
    constructor(io, logger, config) {
        this.io = io;
        this.logger = logger;
        this.config = config;
        this.vkApi = new vkApi(config)
    }

    initEvents(socket) {
        const cookies = socket.request.cookies;
        this.logger.info('socket connected', cookies);
        socket.on('disconnect', this.disconnect.bind(this, socket));
        socket.on('getAlbums', this.getAlbums.bind(this, socket));
    }

    disconnect() {
        this.logger.debug("socket disconnected")
    }

    async getAlbums(socket, data, cb) {
        const res = await this.vkApi.getAlbums();
        cb(res)
    }
}

module.exports = Events;