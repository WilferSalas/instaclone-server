// @packages
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');

// @scripts
const resolvers = require('./gql/resolvers');
const typeDefs = require('./gql/schema');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.db, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, _) => {
    if (err) {
        console.log(`Connection error: ${err}`);
    }

    server();
});

const server = () => {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization;

            if (token) {
                try {
                    const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);

                    return {
                        user
                    };
                } catch (error) {
                    console.log(error);
                    throw new Error('Token invalido');
                }
            }
        }
    });

    apolloServer.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
        console.log(`Server running on port: ${url}`);
    })
};