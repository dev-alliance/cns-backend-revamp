const express = require("express");
const router = express.Router();
const {
  createCustomField,
  getCustomFieldsById,
  deleteCustomFields,
} = require("../controllers/customFields");


router.post("/create-custom-field", createCustomField);

router.get("/custom-field/:id", getCustomFieldsById);

router.delete("/custom-field/:id", deleteCustomFields);

module.exports = router;
