const express = require("express");
const router = express.Router();
const { getTeamsById, updateTeam, createTeam } = require("../controllers/teams");

router.post("/create-team", createTeam);

router.get("/teams/:id", getTeamsById);

router.post("/team/:id", updateTeam);

module.exports = router;
