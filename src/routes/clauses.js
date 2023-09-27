const express = require("express");
const router = express.Router();
const { createClauses, getClausesById, deleteClauses } = require("../controllers/clauses");

router.post("/create-clauses", createClauses);
router.get("/:id", getClausesById);
router.delete("/:id", deleteClauses);
  
module.exports = router;