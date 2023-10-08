import mongoose from "mongoose";

export interface IBranches {
  id: string;
  branchName: string;
  branchId: string;
  address: string;
  pinCode: string;
  contact: string;
  manager: string;
  state: string;
  website: string;
  country: string;
  year: string;
  status: boolean;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Branch:
 *      type: object
 *      required:
 *        - branchName
 *        - branchId
 *        - manager
 *        - address
 *        - state
 *        - country
 *        - code
 *        - contact
 *        - website
 *        - year
 *        - status
 *        - id
 *      properties:
 *        branchName:
 *          type: string
 *        branchId:
 *          type: string
 *        address:
 *          type: string
 *        manager:
 *          type: string
 *        state:
 *          type: string
 *        country:
 *          type: string
 *        code:
 *          type: string
 *        contact:
 *          type: string
 *        website:
 *          type: string
 *        year:
 *          type: number
 *        status:
 *          type: boolean
 *        id:
 *          type: string
 *    BranchResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const BranchSchema = new mongoose.Schema<IBranches>(
  {
    branchName: {
      required: true,
      type: String,
    },
    address: {
      required: false,
      type: String,
    },
    pinCode: {
      required: false,
      type: String,
    },
    contact: {
      required: true,
      type: String,
    },
    manager: {
      required: false,
      type: String,
    },
    state: {
      required: true,
      type: String,
    },
    website: {
      required: false,
      type: String,
    },
    country: {
      required: true,
      type: String,
    },
    branchId: {
      required: false,
      type: String,
      unique: true,
    },
    year: {
      required: true,
      type: String,
    },
    status: {
      required: false,
      type: Boolean,
    },
    id: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Define the Mongoose model for the form data
export const Branch = mongoose.model("cns.branch", BranchSchema);
