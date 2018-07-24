const config = require('../config');
const utils = require('../utils');


const vkAuthMiddleware = async (socket, next) => {
    /*if (process.env.NODE_ENV === 'dev') {
        socket.user = getRandomUser();
        next();
        return
    }*/

    const cookies = socket.request.cookies;
    if (!cookies[config.sessionCookie]) {
        next(new Error("session cookie is required"));
        return
    }

    try {
        socket.user = JSON.parse(utils.decrypt(cookies[config.sessionCookie]));
        next()
    } catch (e) {
        next(e)
    }
};

module.exports = vkAuthMiddleware;