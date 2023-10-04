const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *  schemas:
 *    Admin:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *    AdminResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 */
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("cns.admin", adminSchema);
exports.Admin = Admin;
