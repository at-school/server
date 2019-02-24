const { makeExecutableSchema, gql, AuthenticationError } = require("apollo-server");
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
    async users(_, args, context) {
      if (!context.user) return [];
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

const context = async ({ req }) => {
  // get the user token from the headers
  const token = req.headers.authorization || '';
  if (!token) throw new AuthenticationError('Access Denied, you must log in.'); 
  
  try {
    // decode the jwt token, and get the user id
    const userId = await TokenModel.verifyAccessToken(token).id;  
    // try to retrieve a user with the id
    const user = await UserModel.findById(userId);
 
    // we could also check user roles/permissions here
    if (!user) throw new AuthenticationError('Access Denied, you must log in.'); 
 
    // add the user to the context
    return { user };
  } catch (error) {
    throw new AuthenticationError('Access Denied, you must log in.');  
  }
 }

exports.schema = schema;
exports.context = context;
