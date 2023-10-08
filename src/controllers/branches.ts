import { Request, Response } from "express";
import { Branch } from "../Schema/BranchSchema";

export const createBranch = async (req: Request, res: Response) => {
  try {
    const form = new Branch(req.body);
    await form.save();
    return res
      .status(200)
      .json({ ok: true, message: "Branch Created Successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failed to create branch.");
  }
};

export const getBranchById = async (req: Request, res: Response) => {
  try {
    const branches = await Branch.find({ id: req.params.id });
    res.send(branches);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form branches");
  }
};

export const deleteBranchById = async (req: Request, res: Response) => {
  try {
    const form = await Branch.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      },
    );
    if (!form) {
      res.status(404).send("Branch not found.");
    } else {
      res
        .status(200)
        .send(
          `Branch is ${
            req.body.status ? "Un-archive" : "Archive"
          } successfully.`,
        );
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to archive branch");
  }
};
