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
export const findOneById = async (req: Request, res: Response) => {
  try {
    const teams = await Clauses.findById(req.params.id);
    res.send(teams);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving clauses data");
  }
};

export const getAllClauses = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const clauses = await Clauses.find();

    res.send(clauses);
    // res.status(200).json({ ok: true, data: clauses });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve Clauses.",
      error: error.message,
    });
  }
};
export const EditClauses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTags = await Clauses.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTags) {
      return res.status(404).json({ ok: false, message: "Clauses not found" });
    } else {
      return res
        .status(200)
        .json({ ok: true, message: "Clauses Updated Successfully  " });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const forms = await Clauses.updateOne(
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
        .json({ ok: true, message: "Clauses status updated successfully" });
    } else {
      return res
        .status(422)
        .json({ ok: false, message: "Failed to update Clauses status." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ ok: false, message: "Something went wrong, try again." });
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
