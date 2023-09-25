const mongoose = require("mongoose");
const UserData = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  otp: { type: String, default: null },
});
const User = mongoose.model("userdata", UserData);
module.exports = User;
