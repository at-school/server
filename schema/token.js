const { gql } = require("apollo-server");

const typeDef = gql`
  type Token {
    id: ID
    refreshToken: String
    accessToken: String
    blacklisted: String
  }
`;

const resolvers = {};

exports.resolvers = resolvers;
exports.typeDef = typeDef;
