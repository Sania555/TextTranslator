const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  inputText: String,
  translatedText: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Translation", translationSchema);
