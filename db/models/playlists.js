class Playlists {
    constructor(db, collectionName) {
        this.collection = db.collection(collectionName)
    }

    getAll() {
        return this.collection.find({})
    }
}

module.exports = Playlists;