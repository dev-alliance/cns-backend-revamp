const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  name: String,
  date: { type: Date, default: Date.now },
});

// Define the Mongoose model for the form data
const Tag = mongoose.model("cns.tags", TagSchema);
exports.Tag = Tag;
