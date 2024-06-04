/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema } from "mongoose";

interface Contract extends mongoose.Document {
  userId: object;
  overview: any;
  lifecycle: object;
  discussions: string[];
  attachments: string[];
  shareWith: string[];
  collaburater: string[];
  approval: string[];
  signature: mongoose.Schema.Types.Mixed[];
}

const contractSchema = new mongoose.Schema<Contract>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "cns.users",
    required: false,
  },
  // overview: {
  //   type: Schema.Types.Mixed, // Allows for any arbitrary object structure
  // },
  overview: {
    name: String,
    with_name: String,
    vendor: String,
    currency: String,
    value: String,
    subcategory: String,
    category: {
      ref: "categories",
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    tags: {
      ref: "tags",
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    branch: String,
    team: {
      ref: "team",
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    contractType: String,
    status: String,
  },
  // lifecycle: {
  //   startDate: Date,
  //   endDate: Date,
  //   noticePeriodDate: Date,
  //   renewalOwners: [String],
  // },
  lifecycle: {
    type: Schema.Types.Mixed, // Allows for any arbitrary object structure
  },
  discussions: [Schema.Types.Mixed],
  attachments: [String],
  shareWith: [String],
  collaburater: [String],
  approval: [String],
  signature: [Schema.Types.Mixed],
});

export const Contract = mongoose.model<Contract>(
  "cns.contracts",
  contractSchema
);
