const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  filename: String,
  size: Number,
  profileImage: { type: Boolean, default: false },
});

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  images: [ImageSchema], // Use ImageSchema here
});

module.exports = mongoose.model("User", UserSchema);
