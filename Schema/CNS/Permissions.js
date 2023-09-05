const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    name: String,
    id: String,
    description: String,
    permissions: [],
    date: { type: Date, default: Date.now },
});

// Define the Mongoose model for the form data
const Permissions = mongoose.model("cns.permissions", PermissionSchema);
exports.Permissions= Permissions;
