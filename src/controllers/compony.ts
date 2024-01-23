import { Request, Response } from "express";
import { CompanyModel } from "../Schema/Compony";

import AWS from "aws-sdk";
// Configure AWS
AWS.config.update({
  accessKeyId: "AKIAYIZRJVUCAVYDISPU",
  secretAccessKey: "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",
  region: "ap-southeast-2",
});

const s3 = new AWS.S3();

async function uploadBase64ImageToS3(
  base64Image: string,
  bucketName: string,
  imageName: string,
): Promise<string> {
  const buffer = Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64",
  );

  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: "cns-images-kyc",
    Key: imageName,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpeg", // Adjust the content type as needed
  };

  try {
    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult.Location; // This is the URL of the uploaded image
  } catch (error) {
    console.error("Error in uploading image to S3", error);
    throw error;
  }
}
export const createCompany = async (req: Request, res: Response) => {
  try {
    const existingCompany = await CompanyModel.findOne({
      email: req.body.email,
    });

    if (existingCompany) {
      return res
        .status(422)
        .json({ ok: false, message: "Company already exists." });
    }

    const company = new CompanyModel(req.body);
    await company.save();
    res
      .status(201)
      .json({ ok: true, message: "Company created successfully." });
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: "Failed to create company.",
      error: error.message,
    });
  }
};

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const Compony = await CompanyModel.find({ id: userId });
    res.send(Compony);
    // res.status(200).json({ ok: true, data: Compony });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve compony.",
      error: error.message,
    });
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const forms = await CompanyModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      },
    );
    if (forms.modifiedCount > 0) {
      return res
        .status(200)
        .json({ ok: true, message: "Company status changed  successfully" });
    } else {
      return res
        .status(422)
        .json({ ok: false, message: "Failed to update compony status." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    let imageUrl;

    // Check if there is a new image in the request body
    if (req.body.image) {
      const imageName = `user-images/${Date.now()}.jpg`;

      // Upload the new image to S3
      imageUrl = await uploadBase64ImageToS3(
        req.body.image,
        "your-s3-bucket-name",
        imageName,
      );

      req.body.image = imageUrl;
    }
    console.log(imageUrl);
    console.log(req.body, "req.body");

    const company = await CompanyModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true },
    );
    if (!company) {
      return res.status(400).send("Company not found");
    }

    return res
      .status(200)
      .json({ ok: true, message: "Company details updated successfully" });
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: "Failed to update company.",
      error: error.message,
    });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const result = await CompanyModel.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ ok: true, message: "Company deleted successfully." });
    } else {
      res.status(404).json({ ok: false, message: "Company not found." });
    }
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: "Failed to delete company.",
      error: error.message,
    });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const company = await CompanyModel.findOne({ id: companyId });

    if (!company) {
      res.status(404).json({ ok: false, message: "Company not found." });
    } else {
      res.status(200).json({ ok: true, data: company });
    }
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve company.",
      error: error.message,
    });
  }
};
