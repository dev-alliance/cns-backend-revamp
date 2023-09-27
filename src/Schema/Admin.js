const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  id:String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 0, //root
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
});

const Admin = mongoose.model("cns.admin", adminSchema);
exports.Admin = Admin;
