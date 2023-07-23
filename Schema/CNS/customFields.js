const mongoose = require("mongoose");

const CustomFieldSchema = new mongoose.Schema({
  name: String,
  type:String,
  date: { type: Date, default: Date.now },
});

// Define the Mongoose model for the form data
const CustomField = mongoose.model("cns.customFields", CustomFieldSchema);
exports.CustomField = CustomField;
