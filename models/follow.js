// @pacakges
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FollowSchema = ({
    idUser: {
        ref: 'User',
        required: true,
        type: Schema.Types.ObjectId
    },
    follow: {
        ref: 'User',
        required: true,
        type: Schema.Types.ObjectId
    },
    created: {
        default: Date.now(),
        type: Date
    }
});

module.exports = mongoose.model('Follow', FollowSchema);