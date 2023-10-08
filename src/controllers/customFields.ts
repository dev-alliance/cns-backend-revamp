import { Request, Response } from "express";
const { CustomField } = require("../schema/customFields");

export const createCustomField = async (req: Request, res: Response) => {
  try {
    const form = new CustomField(req.body);
    await form.save();
    return res.status(201).json({ ok: true, message: "Custom Field Created." });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failed to create custom field");
  }
};

export const getCustomFieldsById = async (req: Request, res: Response) => {
  try {
    const forms = await CustomField.find({ id: req.params.id });
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
};

export const deleteCustomFields = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    await CustomField.deleteOne({ _id: req.params.id });
    return res.status(200).send({ ok: true, message: "Custom Field Deleted." });
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to delete custom field");
  }
};
