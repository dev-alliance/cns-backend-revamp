/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema } from "mongoose";

interface Replies {
  text: string;
  date: Date;
  userId: object;
}

export interface Comments {
  style: object;
  range: object;
  access: string;
  date: Date;
  userId: object;
  text: string;
  replies?: Replies[];
  contractId: object;
}

interface Contract extends mongoose.Document {
  userId: object;
  overview: any;
  lifecycle: object;
  discussions: any[];
  attachments: any[];
  shareWith: string[];
  collaburater: any[];
  approval: any[];
  signature: mongoose.Schema.Types.Mixed[];
  createdBy: any;
  contractType: any;
  status: any;
  wordDocumentData: any;
  pdfData: any;
  uploadedWordData: any;
  pages:any[];
  pageSize:object;
  pageMargins:object;
  comments:[Comments];
  newFonts:any[];
  newFontStyles:any[];
  newFontSize:any[]
}

const contractSchema = new mongoose.Schema<Contract>(
  {
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
      disription: String,
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
      teams: {
        ref: "team",
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      },
    },

    lifecycle: {
      type: Schema.Types.Mixed, // Allows for any arbitrary object structure
    },
    discussions: [Schema.Types.Mixed],
    attachments: [Schema.Types.Mixed],
    shareWith: [String],
    collaburater: [Schema.Types.Mixed],
    approval: [Schema.Types.Mixed],
    signature: [Schema.Types.Mixed],
    createdBy: String,
    contractType: String,
    status: String,
    wordDocumentData: String,
    uploadedWordData: String,
    pdfData: {
      type: Schema.Types.Mixed, // Allows for any arbitrary object structure
    },
    pages:{
      type:[]
    },
    pageSize:{
      type:Schema.Types.Mixed,
      required:true
    },
    pageMargins:{
      type:Schema.Types.Mixed,
      required:true
    },
    comments:[],
    newFonts:[],
    newFontSize:[],
    newFontStyles:[]
  },
  {
    timestamps: true,
  },
);

export const Contract = mongoose.model<Contract>(
  "cns.contracts",
  contractSchema,
);
