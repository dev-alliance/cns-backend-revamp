const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: String,
  id: String,
  manager: {},

  status: Boolean,
  members: [],
});

// Define the Mongoose model for the form data
const Team = mongoose.model("cns.team", TeamSchema);
exports.Team = Team;
