/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { Contract } from "../Schema/contract";
import { SUCCESS_CODES } from "../../constants/successCode";
import { ERROR_CODES } from "../../constants/errorCodes";
import mongoose from "mongoose";

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

    // Validate and cleanse overview fields that require ObjectId
    const fieldsRequiringObjectId = ["category", "tags", "team"];
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
      message: "Contract created successfully!",
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
export const getAllContract = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    console.log(userId, "id");

    const contract = await Contract.find({ id: userId })
      .populate({
        path: "overview.team",
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
    // .select("branchName manager status");
    res.send(contract);
    // res.status(200).json({ ok: true, data: contract });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve branch.",
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

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedContract = await Contract.findByIdAndRemove(id);
    if (!deletedContract) {
      return res
        .status(404)
        .json({ ok: false, message: ERROR_CODES.CONTRACTS.NOT_FOUND });
    } else {
      res.json(deletedContract);
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: ERROR_CODES.CONTRACTS.ERROR_DELETING_CONTRACT,
    });
  }
};
