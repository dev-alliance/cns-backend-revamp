import express from "express";
import {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
  getCompanyById,
} from "../controllers/compony";

const router = express.Router();

router.post("/create", createCompany);
router.get("", getAllCompanies);
router.get("/:id", getCompanyById);
router.patch("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;
