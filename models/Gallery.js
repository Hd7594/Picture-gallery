const mongoose = require("mongoose");

const Gallery = mongoose.model("List", {
  name: String,
  dimensions: String,
  color: String,
  author: String,
  links: Boolean,
  numberDownloads: Number,
  camera: String,
  picture: Object,
});

module.exports = Gallery;
