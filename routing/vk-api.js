const querystring = require('querystring');
const requestPromise = require('request-promise');

class VkApi {
    constructor(config) {
        this.config = config;
    }

    async getAlbums() {
        const url = this._getUrl("getAlbums");
        return this.request(url)
    }

    _getUrl(method, params = {}, type = 'audio') {
        const q = querystring.stringify(params);
        return `https://api.vk.com/method/${type}.${method}?access_token=${this.config.vkToken}&v=5.60&${q}`
    }

    async request(url) {
        const options = {
            method: 'GET',
            uri: url,
            json: true
        };
        try {
            return await requestPromise(options)
        } catch (e) {
            return {error: e}
        }
    }
}

module.exports = VkApi;