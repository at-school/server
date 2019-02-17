const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const schema = require("./schema");

mongoose.connect("mongodb://localhost:27017/atschool", {
  useNewUrlParser: true
});
mongoose.connection.once("open", () => {
  console.log("conneted to database");
});

require("dotenv").config();

const server = new ApolloServer({ schema: schema });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
