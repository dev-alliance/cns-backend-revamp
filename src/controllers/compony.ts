import { Request, Response } from "express";
import { CompanyModel } from "../Schema/Compony";

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
    const companies = await CompanyModel.find({});
    res.status(200).json({ ok: true, data: companies });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve companies.",
      error: error.message,
    });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const company = await CompanyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!company) {
      return res.status(400).send("Company not found");
    }

    res.status(200).json({
      ok: true,
      message: "Company updated successfully.",
      data: company,
    });
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
    const company = await CompanyModel.findById(req.params.id);

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
