const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistScheme = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    likes: [String],
    tracks: [
        {
            artist: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 30
            },
            title: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 30
            },
            url: {
                type: String,
                required: true
            },
        }
    ]
});

class Playlists {
    constructor(collectionName) {
        this.model = mongoose.model(collectionName, playlistScheme);
    }

    async getAll() {
        return await this.model.find().exec()
    }

    async getById(id) {
        return await this.model.find({_id: id}).exec()
    }

    async add(data) {
        const p = new this.model(data);
        return await p.save();
    }

    async like(playlistId, uid) {
        return await this.model.update(
            { _id: playlistId },
            { $push: { likes: uid } }
        )
    }

    async unlike(playlistId, uid) {
        return await this.model.update(
            { _id: playlistId },
            { $pull: { likes:  uid }}
        )
    }
}

module.exports = Playlists;