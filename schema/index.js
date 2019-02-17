const { makeExecutableSchema } = require("apollo-server");
const { gql } = require("apollo-server");
const { typeDef: User, resolvers: userResolvers } = require("./user.js");
const { typeDef: Token, resolvers: tokenResolvers } = require("./token.js");
const { UserModel, TokenModel } = require("../models");

const Query = gql`
  type Query {
    user(id: ID!): User
    users(id: ID, name: String, role: String): [User]
    token(id: ID!): Token
    tokens(
      id: ID
      accessToken: String
      refreshToken: String
      blacklisted: Boolean
    ): [Token]
  }
`;

const resolvers = {
  Query: {
    async user(_, args) {
      return await UserModel.findById(args.id);
    },
    async users(_, args) {
      return await UserModel.find(args);
    },
    async token(_, args) {
      return await TokenModel.findById(args.id);
    },
    async tokens(_, args) {
      return await TokenModel.find(args);
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs: [Query, User, Token],
  resolvers: [resolvers, userResolvers, tokenResolvers]
});

module.exports = schema;
