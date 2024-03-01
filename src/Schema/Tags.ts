import mongoose from "mongoose";

export interface ITag {
  id: string;
  name: any;
  status: string;
  createdByName: string;
}

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
const TagSchema = new mongoose.Schema<ITag>(
  {
    id: String,
    createdByName: String,
    name: { type: String, unique: [true] },
    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Define the Mongoose model for the form data add sonme
export const Tag = mongoose.model("tags", TagSchema);
