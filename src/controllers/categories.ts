import { Request, Response } from "express";
import { Categories } from "../Schema/category";
import { SUCCESS_CODES } from "./../../constants/successCode";
import { ERROR_CODES } from "../../constants/errorCodes";

// Create a new category
export const create = async (req: Request, res: Response) => {
  try {
    await Categories.create(req.body);
    return res
      .status(201)
      .json({ ok: true, message: SUCCESS_CODES.CATEGORIES.CATEGORY_CREATED });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: ERROR_CODES.CATEGORIES.ERROR_CREATING_CATEGORY,
    });
  }
};

// Edit a category by ID
export const EditCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Categories.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ ok: false, message: ERROR_CODES.CATEGORIES.NOT_FOUND });
    } else {
      return res
        .status(200)
        .json({ ok: true, message: SUCCESS_CODES.CATEGORIES.CATEGORY_UPDATED });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: ERROR_CODES.CATEGORIES.ERROR_UPDATING });
  }
};

// Disable a category by ID
export const DisableCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Categories.findByIdAndUpdate(
      id,
      { isDisabled: true },
      { new: true }
    );
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ ok: false, message: ERROR_CODES.CATEGORIES.NOT_FOUND });
    } else {
      return res.status(200).json({
        ok: true,
        message: SUCCESS_CODES.CATEGORIES.CATEGORY_DISABLED,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: ERROR_CODES.CATEGORIES.ERROR_DISABLING });
  }
};

// Delete a category by ID
export const DeleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Categories.findByIdAndRemove(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ ok: false, message: ERROR_CODES.CATEGORIES.NOT_FOUND });
    } else {
      return res
        .status(200)
        .json({ ok: true, message: SUCCESS_CODES.CATEGORIES.CATEGORY_DELETED });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: ERROR_CODES.CATEGORIES.ERROR_DELETING });
  }
};
