// @scripts
const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        avatar: String
        created: String
        description: String
        email: String
        id: ID
        name: String
        password: String
        site: String
        userName: String
    }

    type Token {
        token: String
    }

    type UpdateAvatar {
        status: Boolean,
        url: String
    }

    type Publish {
        status: Boolean
        url: String
    }

    type Publications {
        created: String
        file: String
        id: ID
        idUser: ID
        typeFile: String
    }

    type Comment {
        comment: String
        created: String
        idPublication: ID
        idUser: User
    }

    type FeedPublication {
        id: ID
        idUser: User
        file: String
        typeFile: String
        created: String
    }

    input UserInput {
        email: String!
        name: String!
        password: String!
        userName: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input UserUpdateInput {
        currentPassword: String
        description: String
        email: String
        name: String
        newPassword: String
        site: String
        userName: String
    }

    input CommentInput {
        idPublication: ID,
        comment: String
    }

    type Query {
        # User
        getUser(id: ID, userName: String): User
        search(search: String): [User]

        # Follow
        isFollow(userName: String!): Boolean
        getFollowers(userName: String!): [User]
        getFollowing(userName: String!): [User]
        getNotFollowing: [User]

        # Publication
        getPublications(userName: String!): [Publications]
        getPublicationsFollowers: [FeedPublication]

        # Comment
        getComments(idPublication: ID!): [Comment]

        # like
        isLike(idPublication: ID!): Boolean
        countLikes(idPublication: ID!): Int
    }

    type Mutation {
        # User
        register(input: UserInput): User
        login(input: LoginInput): Token
        updateAvatar(file: Upload): UpdateAvatar
        deleteAvatar: Boolean
        updateUser(input: UserUpdateInput): Boolean

        # Follow
        follow(userName: String!): Boolean
        unFollow(userName: String!): Boolean

        # Publication
        publish(file: Upload): Publish

        # Comment
        addComment(input: CommentInput): Comment

        # Like
        addLike(idPublication: ID!): Boolean
        deleteLike(idPublication: ID!): Boolean
    }
`;

module.exports = typeDefs;