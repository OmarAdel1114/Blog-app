const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    enum: ["fiction", "non-fiction"],
    required: true,
  },
  publishTime: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Book", bookSchema);
