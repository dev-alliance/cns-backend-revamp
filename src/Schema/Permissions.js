const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *  schemas:
 *    Permissions:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - description
 *        - permissions
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        permissions:
 *          type: array
 *          items: 
 *             type: object
 *    PermissionsResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const PermissionSchema = new mongoose.Schema({
    name: String,
    id: String,
    description: String,
    permissions: [],
    createdAt: { type: Date, default: Date.now },
});

// Define the Mongoose model for the form data
const Permissions = mongoose.model("cns.permissions", PermissionSchema);
exports.Permissions= Permissions;
