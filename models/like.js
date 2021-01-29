// @packages
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LikeSchema = Schema({
    idPublication: {
        ref: 'Publication',
        requirer: true,
        type: mongoose.Schema.Types.ObjectId
    },
    idUser: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
});

module.exports = mongoose.model('Like', LikeSchema);