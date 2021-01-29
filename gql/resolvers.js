// @scripts
const commentController = require('../controllers/comment');
const followController = require('../controllers/follow');
const likeController = require('../controllers/like');
const publicationController = require('../controllers/publication');
const userController = require('../controllers/user');

const resolvers = {
    Query: {
        // User
        getUser: (_, { id, userName }) => userController.getUser(id, userName),
        search: (_, { search }) => userController.search(search),

        // Follow
        isFollow: (_, { userName }, ctx) => followController.isFollow(userName, ctx),
        getFollowers: (_, { userName }) => followController.getFollowers(userName),
        getFollowing: (_, { userName }) => followController.getFollowing(userName),
        getNotFollowing: (_, {}, ctx) => followController.getNotFollowing(ctx),

        // Publication
        getPublications: (_, { userName }) => publicationController.getPublications(userName),
        getPublicationsFollowers: (_, {}, ctx) => publicationController.getPublicationsFollowers(ctx),

        // Comment
        getComments: (_, { idPublication }) => commentController.getComments(idPublication),

        // Like
        isLike: (_, { idPublication }, ctx) => likeController.isLike(idPublication, ctx),
        countLikes: (_, { idPublication }) => likeController.countLikes(idPublication)
    },
    Mutation: {
        // User
        register: (_, { input }) => userController.register(input),
        login: (_, { input }) => userController.login(input),
        updateAvatar: (_, { file }, ctx) => userController.updateAvatar(file, ctx),
        deleteAvatar: (_, {}, ctx) => userController.deleteAvatar(ctx),
        updateUser: (_, { input }, ctx) => userController.updateUser(input, ctx),

        // Follow
        follow: (_, { userName }, ctx) => followController.follow(userName, ctx),
        unFollow: (_, { userName }, ctx) => followController.unFollow(userName, ctx),

        // Publication
        publish: (_, { file }, ctx) => publicationController.publish(file, ctx),

        // Comment
        addComment: (_, { input }, ctx) => commentController.addComment(input, ctx),

        // Like
        addLike: (_, { idPublication }, ctx) => likeController.addLike(idPublication, ctx),
        deleteLike: (_, { idPublication }, ctx) => likeController.deleteLike(idPublication, ctx)
    }
};

module.exports = resolvers;