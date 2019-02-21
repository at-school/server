const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const schema = require("./schema");
const sgMail = require("@sendgrid/mail");

require("dotenv").config();

const dbName = "atschool";

mongoose.connect(
  process.env.DATABASE_HOST + dbName || "mongodb://localhost:27017/" + dbName,
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
