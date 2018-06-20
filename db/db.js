const mongoClient = require("mongodb").MongoClient;

class Db {
    constructor(config) {
        return new Promise((res, rej) => {
            mongoClient.connect(`mongodb+srv://${config.user}:${config.password}@melody-imews.gcp.mongodb.net/test?retryWrites=true`,
                (err, client) => {
                    if (err) {
                        return rej(err)
                    }
                    const db = client.db(config.db);
                    return res(db)
                }
            );
        })
    }
}

module.exports = Db;