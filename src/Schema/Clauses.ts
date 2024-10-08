import mongoose from "mongoose";

export interface IClauses {
  id: string;
  name: string;
  content: string;
  createdByName: string;
  status: string;
}

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
const ClausesSchema = new mongoose.Schema<IClauses>(
  {
    id: String,
    name: { type: String, unique: true },
    content: String,
    createdByName: String,
    status: { type: String, default: "Active" },
  },
  {
    timestamps: true,
  },
);

// Define the Mongoose model for the form data
export const Clauses = mongoose.model("cns.clauses", ClausesSchema);
