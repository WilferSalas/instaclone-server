// @packages
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = Schema({
    idPublication: {
        ref: 'Publication',
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    idUser: {
        ref: 'User',
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    comment: {
        required: true,
        trim: true,
        type: String
    },
    created: {
        default: Date.now(),
        type: Date
    }
});

module.exports = mongoose.model('Comment', CommentSchema);