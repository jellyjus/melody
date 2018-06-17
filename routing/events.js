class Events {
    constructor(io, logger) {
        this.io = io;
        this.logger = logger;
    }

    initEvents(socket) {
        const cookies = socket.request.cookies;
        this.logger.info('socket connected', cookies);
    }
}

module.exports = Events;