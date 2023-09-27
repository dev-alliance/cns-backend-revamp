const mongoose = require("mongoose");

const ClausesSchema = new mongoose.Schema({
    name: String,
    id: String,
    description: String,
    content: String,
    date: { type: Date, default: Date.now },
});

// Define the Mongoose model for the form data
const Clauses = mongoose.model("cns.clauses", ClausesSchema);
exports.Clauses = Clauses;
