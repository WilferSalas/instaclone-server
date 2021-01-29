// @packages
const { v4: uuidv4 } = require('uuid');

// @scripts
const Follow = require('../models/follow');
const Publication = require('../models/publication');
const User = require('../models/user');
const awsUploadImage = require('../utils/aws-upload-image');

// Querys
const getPublications = async (userName) => {
    const user = await User.findOne({ userName });
    if (!user) throw new Error('Usuario no encontrado');

    const publications = await Publication.find()
        .where({ idUser: user._id })
        .sort({ created: -1 });

    return publications;
};

const getPublicationsFollowers = async (ctx) => {
    const followeds = await Follow.find({ idUser: ctx.user.id }).populate('follow');
    const followedsList = [];
    for await (const data of followeds) {
        followedsList.push(data.follow);
    }

    const publicationsList = [];
    for await (const data of followedsList) {
        const publications = await Publication.find()
            .where({ idUser: data._id })
            .sort({ created: -1 })
            .populate('idUser')
            .limit(5);

        publicationsList.push(...publications);
    }

    const result = publicationsList.sort((a, b) => {
        return new Date(b.created) - new Date (a.created);
    })

    return result;
};

// Mutations
const publish = async (file, ctx) => {
    const { id } = ctx.user;
    const { createReadStream, mimetype } = await file;
    const extension = mimetype.split('/')[1];
    const fileName = `publication/${uuidv4()}.${extension}`;
    const fileData = createReadStream();

    try {
        const result = await awsUploadImage(fileData, fileName);
        const publication = new Publication({
            created: Date.now(),
            file: result,
            idUser: id,
            type: mimetype.split('/')[0]
        });
        publication.save();

        return {
            status: true,
            url: result
        }
    } catch (error) {
        return {
            status: null,
            url: ''
        }
    }
};

module.exports = { publish, getPublications, getPublicationsFollowers };