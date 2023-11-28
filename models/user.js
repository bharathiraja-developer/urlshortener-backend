const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  isActive: Boolean,
  email: String,
  Firstname: String,
  Lastname: String,
  passwordHash: String,
});

module.exports = mongoose.model("user", userSchema, "users");
