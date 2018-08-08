const querystring = require('querystring');
const requestPromise = require('request-promise');

class VkApi {
    constructor(config) {
        this.config = config;
    }

    async getAlbums(uid) {
        const url = this._getUrl("getPlaylists", {owner_id: uid});
        return this._request(url)
    }

    async getAlbumTracks(uid, albumId) {
        const url = this._getUrl("get", {owner_id: uid, album_id: albumId});
        return this._request(url)
    }

    async getTracks(audios) {
        const url = this._getUrl("getById", {audios});
        return this._request(url)
    }

    _getUrl(method, params = {}, type = 'audio') {
        const q = querystring.stringify(params);
        return `https://api.vk.com/method/${type}.${method}?access_token=${this.config.vkToken}&v=5.71&${q}`
    }

    async _request(url) {
        const options = {
            method: 'GET',
            uri: url,
            headers: {
                'User-Agent': 'KateMobileAndroid/49-434 (Android 8.1.0; SDK 27; x86; Google Android SDK built for x86; en)'
            },
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