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
    }
});

class Playlists {
    constructor(collectionName) {
        this.model = mongoose.model(collectionName, playlistScheme);
    }

    getAll() {

    }

    async add(data) {
        const p = new this.model({data});
        await p.save();
    }


}

module.exports = Playlists;