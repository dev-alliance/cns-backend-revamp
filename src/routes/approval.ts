import express from "express";
import {
  createApproval,
  updateApproval,
  findApprovalById,
  findAllApprovals,
  deleteApproval,
} from "../controllers/approval";

const router = express.Router();

// Route to create an approval
router.post("/create", createApproval);

// Route to update an approval
router.put("/update/:id", updateApproval);

router.get("/list", findAllApprovals);
// Route to find an approval by ID
router.get("/:id", findApprovalById);

// Route to delete an approval
router.delete("/delete/:id", deleteApproval);

export default router;
