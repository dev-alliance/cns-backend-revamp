const express = require("express");
const router = express.Router();
const { Branch } = require("../schema/BranchSchema");
const {
  createBranch,
  getBranchById,
  deleteBranchById,
} = require("../controllers/branches");

router.post("/create-branch", createBranch);

router.get("/branch/:id", getBranchById);

router.post("/archive/:id", deleteBranchById);

module.exports = router;
