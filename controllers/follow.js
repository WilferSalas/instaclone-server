// @scripts
const Follow = require('../models/follow');
const User = require('../models/user');

// Querys
const isFollow = async (userName, ctx) => {
    const userFound = await User.findOne({ userName });
    if (!userFound) throw new Error('El usuario no existe');

    const follow = await Follow.find({ idUser: ctx.user.id })
        .where('follow')
        .equals(userFound._id);

    if (follow.length) return true
    else return false
};

const getFollowers = async (userName) => {
    const user = await User.findOne({ userName });
    const followers = await Follow.find({ follow: user._id }).populate('idUser');

    const followersList = [];

    for await (const data of followers) {
        followersList.push(data.idUser);
    }

    return followersList;
};

const getFollowing = async (userName) => {
    const user = await User.findOne({ userName });
    const following = await Follow.find({ idUser: user._id }).populate('follow');

    const followingList = [];

    for await (const data of following) {
        followingList.push(data.follow);
    }

    return followingList;
};

const getNotFollowing = async (ctx) => {
    const user = await User.find().limit(50);

    const users = [];
    for await (const findUser of user) {
        const isFind = await Follow.findOne({ idUser: ctx.user.id })
            .where('follow')
            .equals(findUser._id);

        if (!isFind) {
            if (findUser._id.toString() !== ctx.user.id.toString()) {
                users.push(findUser);
            }
        }
    }

    return users;
};

// Mutations
const follow = async (userName, ctx) => {
    const userFound = await User.findOne({ userName });
    if (!userFound) throw new Error('El usuario no existe');

    try {
        const follow = new Follow({
            idUser: ctx.user.id,
            follow: userFound._id
        });

        follow.save();
        return true;
    } catch (error) {
        console.log(`Error al seguir usuario: ${error}`);
        return false;
    }
};

const unFollow = async (userName, ctx) => {
    const userFound = await User.findOne({ userName });
    if (!userFound) throw new Error('El usuario no existe');

    const follow = await Follow.deleteOne({ idUser: ctx.user.id })
        .where('follow')
        .equals(userFound._id);

    if (follow.deletedCount > 0) return true
    else return false
};

module.exports = {
    follow,
    getFollowers,
    getFollowing,
    getNotFollowing,
    isFollow,
    unFollow
};