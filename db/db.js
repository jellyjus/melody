const mongoClient = require("mongodb").MongoClient;

const playlists = require("./models/playlists");

const PLAYLISTS = "PLAYLISTS";

class Db {
    constructor(config) {
        const db = this;
        return new Promise((res, rej) => {
            mongoClient.connect(`mongodb+srv://${config.user}:${config.password}@melody-imews.gcp.mongodb.net/test?retryWrites=true`,
                (err, client) => {
                    if (err) {
                        return rej(err)
                    }
                     this.db = client.db(config.db);
                    return res(db)
                }
            );
        })
    }

    initModels() {
        this.playlists = new playlists(this.db, PLAYLISTS)
    }
}

module.exports = Db;