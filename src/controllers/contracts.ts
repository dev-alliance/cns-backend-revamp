/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { Contract } from "../Schema/contract";
import { SUCCESS_CODES } from "../../constants/successCode";
import { ERROR_CODES } from "../../constants/errorCodes";
import mongoose from "mongoose";

// const CLIENT_ID =
//   "515496484897-k1rlv3mba7lm3fb5l3sseku8dkvh2msm.apps.googleusercontent.com";
// const CLIENT_SECRET = "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";
// const REFRESH_TOKEN =
//   "1//04sNLIVBl7eOzCgYIARAAGAQSNgF-L9IrKmeVcawXBE1EA9hM9sN72_PCefp-d1FsWpiDuh02VzxGpdrks5ABfIMXPueZrIG6fQ";
// const USER_EMAIL = "dev.alliancetech@gmail.com"; // This should be the Google user's email

export const getContractsByUserId = async (req: Request, res: Response) => {
  try {
    const contracts = await Contract.findById(req.params.id);

    res.status(200).send(contracts);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: ERROR_CODES.CONTRACTS.ERROR_FETCHING_CONTRACT,
    });
  }
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const contractData = req.body;
    console.log(contractData, "contractData");

    // Validate and cleanse overview fields that require ObjectId
    const fieldsRequiringObjectId = [""];
    fieldsRequiringObjectId.forEach((field) => {
      if (
        contractData.overview &&
        typeof contractData.overview[field] === "string" &&
        !mongoose.Types.ObjectId.isValid(contractData.overview[field])
      ) {
        contractData.overview[field] = undefined; // Set invalid ObjectId fields to undefined
      }
    });

    const newContract = await Contract.create(contractData);

    res.status(201).json({
      ok: true,
      message: "Save successfully!",
      contract: newContract,
    });
  } catch (error: any) {
    console.error("Error creating the contract:", error);
    res.status(500).json({
      ok: false,
      message: "Error creating the contract",
      error: error.message,
    });
  }
};
export const updateContract = async (req: Request, res: Response) => {
  try {
    const contractId = req.params.id; // Assuming the contract's ID is passed in the URL
    const contractUpdates = req.body;

    // Validate and cleanse overview fields that require ObjectId
    const fieldsRequiringObjectId = [""];
    fieldsRequiringObjectId.forEach((field) => {
      if (
        contractUpdates.overview &&
        typeof contractUpdates.overview[field] === "string" &&
        !mongoose.Types.ObjectId.isValid(contractUpdates.overview[field])
      ) {
        contractUpdates.overview[field] = undefined; // Set invalid ObjectId fields to undefined
      }
    });

    // Find the contract by ID and update it
    const updatedContract = await Contract.findByIdAndUpdate(
      contractId,
      contractUpdates,
      { new: true }, // This option returns the updated document
    );

    if (!updatedContract) {
      return res.status(404).json({
        ok: false,
        message: "Contract not found",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Save successfully!",
      contract: updatedContract,
    });
  } catch (error: any) {
    console.error("Error updating the contract:", error);
    res.status(500).json({
      ok: false,
      message: "Error updating the contract",
      error: error.message,
    });
  }
};
export const getAllContract = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Assuming 'id' is the user's ID passed in the URL
    console.log(userId, "id");

    // Querying the database for contracts where 'contractType' is not 'template'
    const contracts = await Contract.find({
      userId: userId, // assuming you have a userId field in your contract documents
      contractType: { $ne: "template" }, // Using $ne to filter out 'template'
    })
      .populate({
        path: "overview.teams",
        select: "name _id",
      })
      .populate({
        path: "overview.category",
        select: "name _id",
      })
      .populate({
        path: "overview.tags",
        select: "name _id",
      });

    res.send(contracts);
    // res.status(200).json({ ok: true, data: contract });
  } catch (error: any) {
    console.error("Failed to retrieve contracts:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve contracts.",
      error: error.message,
    });
  }
};

export const getAllContractTemplate = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Assuming 'id' is the user's ID passed in the URL
    console.log(userId, "id");

    // Directly querying the database for contracts with 'contractType' equal to 'template'
    const contracts = await Contract.find({
      userId: userId, // assuming you have a userId field in your contract documents
      contractType: "template", // Ensure this field exists in your schema and is indexed
    });

    res.send(contracts);
    // res.status(200).json({ ok: true, data: contract });
  } catch (error: any) {
    console.error("Failed to retrieve contracts:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve contracts.",
      error: error.message,
    });
  }
};

export const createOrUpdateContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(req.body);

    const { recipient } = req.body; // The new array of signatures to be set

    const updatedContract = await Contract.findOneAndUpdate(
      { _id: id }, // Find a contract by its id
      {
        $set: { signature: recipient }, // Replace the signature array with the new one
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if one doesn't exist
      },
    );

    return res.json(updatedContract);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      message: "Error updating or creating contract.",
    });
  }
};

export const findOneById = async (req: Request, res: Response) => {
  try {
    const contract = await Contract.findById(req.params.id);
    res.send(contract);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving contract data");
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const result = await Contract.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ ok: true, message: "Document deleted successfully" });
    } else {
      res.status(404).json({ ok: false, message: "Document not found" });
    }
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: "Failed to delete Document",
      error: error.message,
    });
  }
};
