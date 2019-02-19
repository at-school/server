const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const schema = require("./schema");
const sgMail = require("@sendgrid/mail");

require("dotenv").config();

mongoose.connect(
  process.env.DATABASE_HOST || "mongodb://localhost:27017/atschool",
  {
    useNewUrlParser: true
  }
);
mongoose.connection.once("open", () => {
  console.log("conneted to database");
});

sgMail.setApiKey(process.env.SENDGRID_APIKEY);
var os = require("os");
console.log(os.hostname())

const server = new ApolloServer({ schema: schema });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
