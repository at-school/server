const { makeExecutableSchema } = require("apollo-server");
const { gql } = require("apollo-server");
const { typeDef: User, resolvers: userResolvers } = require("./user.js");
const UserModel = require("../models");

const Query = gql`
  type Query {
    user(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    user(_, args) {
      return UserModel.findById(args.id);
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs: [Query, User],
  resolvers: [resolvers, userResolvers]
});

module.exports = schema;
