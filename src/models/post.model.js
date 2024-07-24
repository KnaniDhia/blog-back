const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    Titre: {
        type: String,
        required: true
    },
    Contenu: {
        type: String
    },
    image: {
        type: String // Path to the image file
    },
    keywords: [{
        type: String,
    }]
}, {
    timestamps: true
});

const PostActualite = mongoose.model('PostActualite', postSchema);
module.exports = PostActualite;