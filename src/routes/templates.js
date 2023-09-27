const express = require("express");
const router = express.Router();
const { createTemplate, getTemplateById, deleteTemplate } = require("../controllers/templates");


router.post("/create-template", createTemplate);

router.get("/:id", getTemplateById);

router.delete("/delete-template/:id",deleteTemplate);

module.exports = router