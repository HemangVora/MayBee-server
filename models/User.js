const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  address: String,
  isClaimed: Boolean,
  username: String,
  privateKey: String,
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
