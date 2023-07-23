const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id:String,
  firstName: String,
  lastName: String,
  job: String,
  team: {},
  landline: String,
  mobile: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: 0, //root
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  image:String,
  status:Boolean,
  disabled:{
    type:Boolean,
    default:false
  }

});

const Normal = mongoose.model("cns.users", userSchema);
exports.Normal = Normal;
