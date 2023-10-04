const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *  schemas:
 *    CustomFields:
 *      type: object
 *      required:
 *        - name
 *        - type
 *      properties:
 *        name:
 *          type: string
 *        type:
 *          type: string
 *    CustomFieldsResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const CustomFieldSchema = new mongoose.Schema({
  name: String,
  type:String,
  createdAt: { type: Date, default: Date.now },
});

// Define the Mongoose model for the form data
const CustomField = mongoose.model("cns.customFields", CustomFieldSchema);
exports.CustomField = CustomField;
