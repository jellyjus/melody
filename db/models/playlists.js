const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistScheme = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    likes: {
        type: Number,
        default: 0
    },
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    tracks: [
        {
            author: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 20
            },
            name: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 20
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

    async add(data) {
        const p = new this.model({data});
        return await p.save();
    }


}

module.exports = Playlists;