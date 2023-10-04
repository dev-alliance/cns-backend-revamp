const mongoose = require("mongoose");


/**
 * @openapi
 * components:
 *  schemas:
 *    Clauses:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - description
 *        - content
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        content:
 *          type: string
 *    ClausesResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const ClausesSchema = new mongoose.Schema({
    name: String,
    id: String,
    description: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
});

// Define the Mongoose model for the form data
const Clauses = mongoose.model("cns.clauses", ClausesSchema);
exports.Clauses = Clauses;
