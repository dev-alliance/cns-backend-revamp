const express = require("express");
const router = express.Router();
const { Team } = require("../schema/TeamSchema");
const { User } = require("../Schema/User");
const {
  createUser,
  getUsersById,
  disableUser,
  userStats,
  deleteUser,
} = require("../controllers/users");

router.post("/add-user", createUser);

router.get("/users/:id", getUsersById);

router.get("/disable-user/:id/:status", disableUser);

router.get("/user-status/:stat", userStats);

router.delete("/user/:id", deleteUser);

module.exports = router;
