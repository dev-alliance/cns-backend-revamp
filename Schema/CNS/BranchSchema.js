const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
  branchName: String,
  address: String,
  code:String,
  contact:String,
  manager:String,
  state: String,
  website: String,
  country: String,
  branchId: String,
  year: Number,
  status: Boolean,
});

// Define the Mongoose model for the form data
const Branch = mongoose.model("branch", BranchSchema);
exports.Branch = Branch;
