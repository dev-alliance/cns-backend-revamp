import { Request, Response } from "express";
const { Templates } = require("../Schema/TemplateSchema");

export const createTemplate = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const r = new Templates(req.body);
    await r.save();
    return res.json({ ok: true, message: "Template upload successfully." });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, message: "Failed to upload template" });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const r = await Templates.find({ id: req.params.id });
    return res.json({ ok: true, data: r });
  } catch (err) {
    return res.json({ ok: false, message: "Failed to load template." });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const r = await Templates.deleteOne({ _id: req.params.id });
    if (r.deletedCount > 0) {
      return res.json({ ok: true, data: r, message: "Template deleted." });
    } else {
      return res
        .status(400)
        .json({ ok: false, data: r, message: "Failed to delete template." });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ ok: false, message: "Failed to delete template." });
  }
};
