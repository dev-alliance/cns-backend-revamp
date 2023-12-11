import express from "express";
import {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
  getCompanyById,
  changeStatus,
} from "../controllers/compony";

const router = express.Router();

router.post("/create", createCompany);
router.get("/list-compony/:id", getAllCompanies);
router.get("/single/:id", getCompanyById);
router.patch("/:id", updateCompany);
router.delete("/:id", deleteCompany);
router.patch("/updte-status/:id", changeStatus);

export default router;
