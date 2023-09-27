const express = require("express");
const {
  createPermission,
  getPermissions,
  deletePermissions,
} = require("../controllers/permissions");
const router = express.Router();

router.post("/create-permission", createPermission);
router.get("/:id", getPermissions);
router.delete("/:id", deletePermissions);

module.exports = router;
