const config = require('../config');
const crypto = require('crypto');
const request = require('request');

const vkAuthMiddleware = (socket) => {
    return new Promise((resolve, rej) => {
        if (process.env.NODE_ENV === 'dev')
            return setUser(socket, '96113254', resolve);

        socket.uid = false;
        const cookies = socket.request.cookies;
        if (cookies.auth_key && cookies.viewer_id) {
            const tmp = `${config.vk_appId}_${cookies.viewer_id}_${config.vk_clientSecret}`;
            const hex = crypto.createHash('md5').update(tmp).digest("hex");
            if (cookies.auth_key === hex) {
                setUser(socket, cookies.viewer_id, resolve);
            }
        }
    })
};

const setUser = (socket, uid, resolve) => {
    request(`https://api.vk.com/method/users.get?user_id=${uid}&fields=photo_50&v=5.52`, { json: true }, (err, res, body) => {
        socket.user = body.response[0];
        console.log('user connected', socket.user);
        resolve();
    })
};

module.exports = vkAuthMiddleware;