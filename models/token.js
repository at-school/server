const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const randtoken = require("rand-token");

const tokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    default: ""
  },
  accessToken: String,
  purpose: {
    type: String,
    enum: ["ACCOUNT_CONFIRMATION", "ACCOUNT_ACCESS", "PASSWORD_RESET"]
  },
  blacklisted: {
    type: Boolean,
    default: false
  }
});

tokenSchema.statics.generateAccessToken = async payload => {
  const privateKeyPath = path.join(
    path.dirname(require.main.filename),
    "private.key"
  );
  const privateKey = await fs.readFileSync(privateKeyPath);
  const token = await jwt.sign(payload, privateKey, {
    expiresIn: "12h",
    algorithm: "RS256"
  });
  return token;
};

tokenSchema.statics.verifyAccessToken = async token => {
  const publicKeyPath = path.join(
    path.dirname(require.main.filename),
    "public.key"
  );
  const publicKey = fs.readFileSync(publicKeyPath);
  const tokenData = await jwt.verify(token, publicKey, {
    algorithm: "RS256"
  });
  return tokenData;
};

tokenSchema.statics.generateRefreshToken = async () => {
  const token = randtoken.uid(256);
  return token;
};

module.exports = mongoose.model("Token", tokenSchema);
