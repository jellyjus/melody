const express = require('express');
const crypto = require('crypto');
const requestPromise = require('request-promise');
const router = express.Router();
const utils = require('../utils');
const config = require('../config');

let index = 0;
const defaultUsers = [{
    "id": 96113254,
    "first_name": "Евгений",
    "last_name": "Сироткин",
    "photo_100": "https://pp.userapi.com/XOEZ40d8sJY9bzL7iMacqQkSB5EWKEJYO5fbyA/0fJMZBEBNzQ.jpg?ava=1"
}, {
    "id": 106074986,
    "first_name": "Николай",
    "last_name": "Куликов",
    "photo_100": "https://pp.userapi.com/c824201/v824201226/11d433/OClKAZWjQME.jpg?ava=1"
},
    {
        "id": 62943253,
        "first_name": "Николай",
        "last_name": "Пархимович",
        "photo_100": "https://pp.userapi.com/c636524/v636524253/755b5/eyxu3Xsb29o.jpg?ava=1"
    }];

router.get('/login', async function(req, res) {
    try {
        if (process.env.NODE_ENV === 'dev') {
            const user = getRandomUser();
            res.cookie(config.sessionCookie, utils.encrypt(JSON.stringify(user)));
            return res.json(user);
        }

        if (req.cookies[config.sessionCookie]) {
            return res.json(JSON.parse(utils.decrypt(req.cookies[config.sessionCookie])));
        }

        const cookies = req.cookies;
        if (!cookies.auth_key || !cookies.viewer_id)
            return res.json({err: 'auth_key and viewer_id are required!'});

        const tmp = `${config.vk_appId}_${cookies.viewer_id}_${config.vk_clientSecret}`;
        const hex = crypto.createHash('md5').update(tmp).digest("hex");
        if (cookies.auth_key === hex) {
            const user = await getUser(cookies.viewer_id);
            res.cookie(config.sessionCookie, utils.encrypt(JSON.stringify(user)));
            return res.json(user);
        }

        return res.json({err: 'auth_key or viewer_id is invalid!'});
    } catch (e) {
        console.log("Error on /login", e);
        res.json({err: e.toString()})
    }

});

const getUser = async (uid) => {
    const res = await requestPromise(`https://api.vk.com/method/users.get?user_id=${uid}&fields=photo_100&lang=ru&access_token=${config.vk_serviceKey}&v=5.80`, { json: true });
    if (res.error) {
        throw new Error(`can't get user: ${res.error.error_msg}`)
    }

    return res.response[0];
};

const getRandomUser = () => {
    index++;
    return defaultUsers[index % defaultUsers.length]
    //return defaultUsers[Math.floor(Math.random()*defaultUsers.length)];
};

module.exports = router;