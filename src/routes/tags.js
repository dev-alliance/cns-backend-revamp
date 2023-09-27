const express = require("express");
const router = express.Router();
const { createTag, getTags } = require("../controllers/tags");

router.post("/create-tag", createTag);

router.get("/tag/:id", getTags);

module.exports = router;
