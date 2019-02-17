const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    default: ""
  },
  accessToken: String,
  blacklisted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Token", tokenSchema);
