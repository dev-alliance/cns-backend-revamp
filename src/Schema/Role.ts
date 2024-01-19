import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: true,
  },
  createdByName: String,
  desc: String,
  permissions: {
    type: Map,
    of: Boolean,
  },
});

export const Role = mongoose.model("Role", roleSchema);
