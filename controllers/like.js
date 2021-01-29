// @models
const Like = require('../models/like');

// Querys
const isLike = async (idPublication, ctx) => {
    try {
        const like = await Like.findOne({ idPublication })
            .where({ idUser: ctx.user.id });

        if (!like) return false;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const countLikes = async (idPublication) => {
    try {
        const likes = await Like.countDocuments({ idPublication });

        return likes;
    } catch (error) {
        console.log(error)
    }
};

// Mutations
const addLike = (idPublication, ctx) => {
 try {
     const like = new Like({
         idPublication,
         idUser: ctx.user.id
     });
     like.save();

     return true;
 } catch (error) {
     console.log(error);
     return false;
 }
};

const deleteLike = async (idPublication, ctx) => {
    try {
        await Like.findOneAndDelete({ idPublication })
            .where({ idUser: ctx.user.id });

        return true
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = { addLike, deleteLike, countLikes, isLike };