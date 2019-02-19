const { UserModel, TokenModel } = require("../models");
const { gql } = require("apollo-server");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");

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
    sendAccountConfirmationEmail(id: ID!): Boolean
  }
`;

const resolvers = {
  Mutation: {
    createUser: async (_, args) => {
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
          password: hash,
          role: "3"
        });
        const saved_user = await user.save();
        return saved_user;
      } catch (err) {
        throw new Error(err);
      }
    },
    sendAccountConfirmationEmail: async (_, args) => {
      try {
        const accessToken = await TokenModel.generateAccessToken({
          id: args.id,
          purpose: "ACCOUNT_CONFIRMATION"
        });
        // get user email
        const user = await UserModel.findById(args.id, "email name");
        sgMail.send({
          to: user.email,
          from: "phamduyanh249@live.com",
          templateId: "d-568dab4b296d45a18264baeffdac7ba2",
          dynamic_template_data: {
            name: user.name,
            activationLink:
              process.env.FRONTEND_HOSTNAME +
              "account-confirmation/" +
              accessToken
          }
        });
        return true;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

exports.resolvers = resolvers;
exports.typeDef = typeDef;
