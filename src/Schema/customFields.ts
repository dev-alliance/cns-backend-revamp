import mongoose from "mongoose";

export interface ICustomField {
  id: string;
  name: any;
  uploaded_by: string;
  value: string;
  createdByName: string;
  type: string;
}

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
const CustomFieldSchema = new mongoose.Schema<ICustomField>(
  {
    id: String,
    name: { type: String, unique: [true, "this name already exists"] },
    uploaded_by: String,
    createdByName: String,
    value: String,
    type: String,
  },
  {
    timestamps: true,
  }
);

// Define the Mongoose model for the form data
export const CustomField = mongoose.model(
  "cns.customFields",
  CustomFieldSchema
);
