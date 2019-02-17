const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    validate: [
      email => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      "This email is invalid."
    ]
  },
  password: String,
  role: {
    type: String,
    enum: ["1", "2", "3"]
  },
  isAccountConfirm: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);
