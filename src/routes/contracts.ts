import express from "express";
import {
  createContract,
  deleteContract,
  getAllContract,
  getContractsByUserId,
  createOrUpdateContract,
  findOneById,
  updateContract,
} from "../controllers/contracts";

const router = express.Router();

router.get("/:id", getContractsByUserId);
router.post("/create", createContract);
router.get("/list-contract/:id", getAllContract);
router.patch("/createUpdate/:id", createOrUpdateContract);
router.put("/updateDocument/:id", updateContract);
router.delete("/:id", deleteContract);
router.get("/:id", findOneById);

export default router;
