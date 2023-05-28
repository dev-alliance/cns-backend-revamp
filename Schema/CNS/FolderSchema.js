const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  subfolders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: [],
    },
  ],
  files: [
  {
    name:String,
    desc:String,
    file:String
  } 
  ], timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Folder = mongoose.model("Folder", folderSchema);
exports.Folder = Folder;
