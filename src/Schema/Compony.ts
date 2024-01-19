import mongoose from "mongoose";

export interface ICompanyDocument extends mongoose.Document {
  companyName: string;
  companySize: string;
  country: string;
  timeZone: string;
  email: string;
  phoneNumber: string;
  industry: string;
  websiteUrl: string;
}

const companySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    companyName: { type: String, required: true },
    companySize: { type: String, required: true },
    country: { type: String, required: true },
    timeZone: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    industry: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    billing_email: { type: String },
    image: String,
    status: { type: String, default: "Active" },
  },
  {
    timestamps: true,
  },
);

export const CompanyModel = mongoose.model<ICompanyDocument>(
  "Company",
  companySchema,
);
