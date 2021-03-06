const { UserModel, TokenModel } = require("../models");
const {
  ApolloError, 
  gql, 
} = require("apollo-server");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");

const errorMessages = {
  'email_used': "This email has already been used.",
  'pw_not_match': "Password must match confirmed password.",
  'pw_8_char': "Password must be at least 8 characters.",
  'email_pw_incorrect': "Your email or password is incorrect.",
  'token_error': "Error generating the token."
}

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

    signin(
      email: String!
      password: String!
    ): Token

    sendAccountConfirmationEmail(id: ID!): Boolean
  }
`;

const resolvers = {
  Mutation: {
    createUser: async (_, args) => {
      if (await UserModel.findOne({ email: args.email })) {
        // if a user with this email already exists
        return new ApolloError(errorMessages.email_used, 400);
      }

      if (args.password !== args.confirmedPassword) {
        return new ApolloError(errorMessages.pw_not_match, 400);
      } else if (args.password.length < 8) {
        return new ApolloError(errorMessages.pw_8_char, 400);
      }
      try {
        const hash = await getPasswordHash(args.password);
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
    signin: async (_, args) => {
      const user = await UserModel.findOne({ email: args.email });
      if (!user) {
        // if the user cannot be found
        return new ApolloError(errorMessages.email_pw_incorrect, 400);
      }

      // compare the user input password
      if (!await bcrypt.compare(args.password, user.password)) {
        // password is incorrect
        return new ApolloError(errorMessages.email_pw_incorrect, 400);
      }

      try {
        // finally, return the tokens
        const token = new TokenModel({
          refreshToken: await TokenModel.generateRefreshToken(),
          accessToken: await TokenModel.generateAccessToken({
            id: user.id,
            purpose: "ACCOUNT_ACCESS"
          }),
          purpose: "ACCOUNT_ACCESS"
        });
        
        const saved_token = await token.save();
        return saved_token;
      } catch (err) {
        throw ApolloError(errorMessages.token_error);
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

/**
 * Get the hash for the input password
 * @param {*} password 
 * @returns hash
 */
async function getPasswordHash(password) {
  return bcrypt.hash(password, 10);
}


exports.resolvers = resolvers;
exports.typeDef = typeDef;
