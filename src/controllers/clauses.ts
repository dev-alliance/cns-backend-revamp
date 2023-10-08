import { Request, Response } from "express";
import { Clauses } from "../Schema/Clauses";

export const createClauses = async (req: Request, res: Response) => {
  try {
    const form = new Clauses(req.body);
    await form.save();
    return res
      .status(201)
      .json({ ok: true, message: "Clauses Created Successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Failed to create clauses.");
  }
};

export const getClausesById = async (req: Request, res: Response) => {
  try {
    const forms = await Clauses.find({ id: req.params.id });
    res.status(200).send(forms);
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to retrieving clauses data.");
  }
};

export const deleteClauses = async (req: Request, res: Response) => {
  try {
    const forms = await Clauses.deleteOne({ _id: req.params.id });
    if (forms.deletedCount > 0) {
      return res.json({ ok: true, message: "Clause Deleted Successfully." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to delete clauses.");
  }
};
