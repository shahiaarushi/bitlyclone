const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  uri: { type: String, required: true },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, unique: true },
  clickCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String }, // Optional, for user-specific URLs
});

module.exports = mongoose.model("URL", urlSchema);
