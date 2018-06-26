const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const playlists = require("./models/playlists");

const PLAYLISTS = "PLAYLISTS";

class Db {
    constructor(config) {
        const db = this;
        return new Promise((res, rej) => {
            mongoose.connect(`mongodb+srv://${config.user}:${config.password}@melody-imews.gcp.mongodb.net/test?retryWrites=true`, null, err => {
                if (err) {
                    return rej(err)
                }
                return res(db)
            });
        })
    }

    initModels() {
        this._playlists = new playlists(PLAYLISTS)
    }

    get playlists() {
        return this._playlists
    }
}

module.exports = Db;