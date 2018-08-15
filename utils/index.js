const crypto = require('crypto');
const config = require('../config');

const algorithm = 'rc4';

const encrypt = (text) => {
    const cipher = crypto.createCipher(algorithm, config.vk_clientSecret);
    let crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

const decrypt = (text) => {
    const decipher = crypto.createDecipher(algorithm, config.vk_clientSecret);
    let dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};

const getRandomItem = (array) => {
    return array[Math.floor(Math.random()*array.length)];
};

function* getPseudoRandomLetterGenerator(str) {
    const array = [];

    for (let i=0; i<str.length; i++)
        array.push({item: str[i], index: i})

    let i = array.length;
    while (i--) {
        const letter = array.splice(Math.floor(Math.random() * (i+1)), 1)[0];
        if (i)
            yield letter;
        else
            return letter;
    }
}

module.exports = {
    encrypt,
    decrypt,
    getRandomItem,
    getPseudoRandomLetterGenerator
};