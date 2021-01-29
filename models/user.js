// @pacakges
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {
        require: true,
        type: String
    },
    userName: {
        require: true,
        trim: true,
        type: String,
        unique: true
    },
    email: {
        require: true,
        trim: true,
        type: String,
        unique: true
    },
    avatar: {
        trim: true,
        type: String
    },
    site: {
        trim: true,
        type: String
    },
    description: {
        trim: true,
        type: String
    },
    password: {
        required: true,
        strim: true,
        type: String
    },
    created: {
        default: Date.now(),
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);