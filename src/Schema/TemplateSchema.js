const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *  schemas:
 *    Templates:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - file
 *        - desc
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        file:
 *          type: string
 *        desc:
 *          type: string
 *    TemplatesResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const templateSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    required: true,
  },
  file: String,
  desc:String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Templates = mongoose.model("template", templateSchema);
exports.Templates = Templates;
