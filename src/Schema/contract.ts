/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema } from "mongoose";

// interface Overview {
//   name: string;
//   vendor: string;
//   currency: string;
//   value: number;
//   category: string;
//   tags: string[];
//   branch: string;
//   team: string;
//   contractType: string;
//   status: string;
// }

// interface Lifecycle {
//   startDate: Date;
//   endDate: Date;
//   noticePeriodDate: Date;
//   renewalOwners: string[];
// }

// interface Discussions {
//   userid: string;
//   comment: string;
//   mentions: [];
//   date_time: Date;
// }

interface Contract extends mongoose.Document {
  userId: object;
  overview: object;
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
    ref: "User", // Reference to the User schema
    // required: true,
  },
  overview: {
    type: Schema.Types.Mixed, // Allows for any arbitrary object structure
  },
  // overview: {
  //   name: String,
  //   vendor: String,
  //   currency: String,
  //   value: Number,
  //   category: String,
  //   tags: [String],
  //   branch: String,
  //   team: String,
  //   contractType: String,
  //   status: String,
  // },
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
  contractSchema,
);
