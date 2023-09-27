const express = require("express");
const { createAdmin, verifyEmail, login, updatePassword } = require("../controllers/admin");
const router = express.Router()

router.post("/create-user", createAdmin);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/update-password", updatePassword);

module.exports = router;