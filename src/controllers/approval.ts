import { Request, Response } from "express";
import { Approval } from "../Schema/Approval";
// Replace with the correct path to your Approval model

// Create Approval
export const createApproval = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const approval = new Approval(req.body);
    await approval.save();
    return res
      .status(200)
      .json({ ok: true, message: "Approval created Successfully" });
  } catch (err: any) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "A approval with this name already exists",
      });
    }
    return res
      .status(400)
      .json({ ok: false, message: "Failed to create approval" });
  }
};

// Update Approval
export const updateApproval = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const updatedApproval = await Approval.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      ok: true,
      message: "Approval updated Successfully",
      updatedApproval,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, message: "Failed to update approval" });
  }
};

// Find Approval by ID
export const findApprovalById = async (req: Request, res: Response) => {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) {
      return res.status(404).json({ ok: false, message: "Approval not found" });
    }
    res.send(approval);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, message: "Error in finding approval" });
  }
};

// Find All Approvals

export const findAllApprovals = async (req: Request, res: Response) => {
  try {
    const approvals = await Approval.find()
      .populate({
        path: "approver",
        select: "firstName lastName _id",
      })
      .select("-loginHistory"); // Exclude the loginHistory field

    res.send(approvals);
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve approvals",
      error: error.message,
    });
  }
};

// Delete Approval
export const deleteApproval = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await Approval.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ ok: true, message: "Approval deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, message: "Error in deleting approval" });
  }
};
