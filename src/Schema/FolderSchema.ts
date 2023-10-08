import mongoose from "mongoose";

export interface IFolder {
  modifiedCount: any;
  id: string;
  name: string;
  permissions: [];
  parent: {};
  subFolders: [];
  files: [];
}

const folderSchema = new mongoose.Schema<IFolder>(
  {
    id: String,
    name: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    subFolders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: [],
      },
    ],
    files: [
      {
        name: String,
        desc: String,
        file: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Folder = mongoose.model("cns.folder", folderSchema);
