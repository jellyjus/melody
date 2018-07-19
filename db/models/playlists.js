const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = {
    id: {
        type: Number,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    last_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    photo_50: {
        type: String,
        required: true
    }
};

const playlistScheme = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    author: user,
    likes: [user],
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

    async like(playlistId, user) {
        return await this.model.update(
            { _id: playlistId },
            { $push: { likes: user } }
        )
    }

    async unlike(playlistId, user) {
        return await this.model.update(
            { _id: playlistId },
            { $pull: { likes:  user }}
        )
    }
}

module.exports = Playlists;