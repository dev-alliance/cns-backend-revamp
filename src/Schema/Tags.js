const mongoose = require("mongoose");


/**
 * @openapi
 * components:
 *  schemas:
 *    Tags:
 *      type: object
 *      required:
 *        - id
 *        - name
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *    TagResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const TagSchema = new mongoose.Schema({
  id:String,
  name: String,
  createdAt: { type: Date, default: Date.now },
});

// Define the Mongoose model for the form data
const Tag = mongoose.model("cns.tags", TagSchema);
exports.Tag = Tag;
