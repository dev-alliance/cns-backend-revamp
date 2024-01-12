import mongoose from "mongoose";

const ApprovalSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    id: String,
    approver: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cns.users",
      },
    ],
    description: String,
    createdByName: String,
    type: String,
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  },
);

export const Approval = mongoose.model("approval", ApprovalSchema);
