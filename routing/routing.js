const express = require('express');
const crypto = require('crypto');
const requestPromise = require('request-promise');
const router = express.Router();
const config = require('../config');

router.get('/login', async function(req, res) {
    try {
        if (req.signedCookies[config.sessionCookie])
            return res.json(req.signedCookies[config.sessionCookie]);

        if (process.env.NODE_ENV === 'dev') {
            const user = await getUser('96113254');
            res.cookie(config.sessionCookie, user, {signed: true});
            return res.json(user);
        }

        const cookies = req.cookies;
        if (!cookies.auth_key || !cookies.viewer_id)
            return res.json({err: 'auth_key and viewer_id are required!'});

        const tmp = `${config.vk_appId}_${cookies.viewer_id}_${config.vk_clientSecret}`;
        const hex = crypto.createHash('md5').update(tmp).digest("hex");
        if (cookies.auth_key === hex) {
            const user = await getUser(cookies.viewer_id);
            res.cookie(config.sessionCookie, user, {signed: true});
            return res.json(user);
        }

        return res.json({err: 'auth_key or viewer_id is invalid!'});
    } catch (e) {
        console.log("Error on /login", e);
        res.json({err: e.toString()})
    }

});

const getUser = async (uid) => {
    const res = await requestPromise(`https://api.vk.com/method/users.get?user_id=${uid}&fields=photo_50&access_token=${config.vk_serviceKey}&v=5.80`, { json: true });
    if (res.error) {
        throw new Error(`can't get user: ${res.error.error_msg}`)
    }

    return res.response[0];
};

module.exports = router;