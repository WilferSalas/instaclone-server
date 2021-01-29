const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PublicationSchema = ({
    idUser: {
        ref: 'User',
        require: true,
        type: mongoose.Schema.Types.ObjectId
    },
    file: {
        require: true,
        trim: true,
        type: String
    },
    typeFile: {
        trim: true,
        type: String
    },
    created: {
        default: Date.now(),
        type: Date
    }
});

module.exports = mongoose.model('Publication', PublicationSchema);