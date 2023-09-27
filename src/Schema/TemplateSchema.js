const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    required: true,
  },
  file: String,
  desc:String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Templates = mongoose.model("template", templateSchema);
exports.Templates = Templates;
