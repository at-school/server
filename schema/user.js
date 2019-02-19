const { UserModel } = require("../models");
const {
  ApolloError, 
  gql, 
} = require("apollo-server");
const bcrypt = require("bcrypt");

const typeDef = gql`
  type User {
    id: ID
    name: String
    email: String
    password: String
    role: String
    isAccountConfirm: Boolean
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      confirmedPassword: String!
      role: String!
    ): User
    signin(email: String!, password: String!): Token
  }
`;

const resolvers = {
  Mutation: {
    createUser: async (_, args) => {
      if (await UserModel.findOne({ email: args.email })) {
        // if a user with this email already exists
        return new ApolloError("This email has already been used.", 400);
      }

      if (args.password !== args.confirmedPassword) {
        return new ApolloError("Password must match confirmed password.", 400);
      } else if (args.password.length < 8) {
        return new ApolloError("Password must be at least 8 characters.", 400);
      }
      try {
        const hash = await bcrypt.hash(args.password, 10);
        const user = await new UserModel({
          name: args.name,
          email: args.email,
          password: hash
        });
        const saved_user = await user.save();

        return saved_user;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

exports.resolvers = resolvers;
exports.typeDef = typeDef;
