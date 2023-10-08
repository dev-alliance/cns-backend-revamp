import mongoose from "mongoose";

export interface ITemplate {
  id: string;
  name: string;
  file: string;
  description: string;
}

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
const templateSchema = new mongoose.Schema<ITemplate>(
  {
    id: String,
    name: {
      type: String,
      required: true,
    },
    file: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

export const Template = mongoose.model("cns.templates", templateSchema);

