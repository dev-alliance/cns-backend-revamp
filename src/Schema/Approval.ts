import mongoose from "mongoose";

const ApprovalSchema = new mongoose.Schema(
  {
    name: String,
    id: String,
    approver: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cns.users",
      },
    ],
    description: String,
    type: String,
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

export const Approval = mongoose.model("cns.approval", ApprovalSchema);
