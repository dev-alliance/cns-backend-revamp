import express from "express";
import {
  createContract,
  deleteContract,
  getAllContract,
  getContractsByUserId,
  createOrUpdateContract,
} from "../controllers/contracts";

const router = express.Router();

router.get("/:id", getContractsByUserId);
router.post("/create", createContract);
router.get("/list-contract/:id", getAllContract);
router.patch("/createUpdate/:id", createOrUpdateContract);
router.delete("/:id", deleteContract);

export default router;
