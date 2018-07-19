const config = require('../config');

const userDefault = {"id":96113254,"first_name":"Evgeny","last_name":"Sirotkin","photo_50":"https://pp.userapi.com/CIesIzFUuKSMa-zNpuSFGulmUsDzw4-5rMISXw/M5t_B2Js8IE.jpg?ava=1"}


const vkAuthMiddleware = async (socket, next) => {
    if (process.env.NODE_ENV === 'dev') {
        socket.user = userDefault;
        next();
        return
    }

    const cookies = socket.request.signedCookies;
    if (!cookies[config.sessionCookie]) {
        next(new Error("session cookie is required"));
        return
    }

    socket.user = cookies[config.sessionCookie];
    next()
};

module.exports = vkAuthMiddleware;