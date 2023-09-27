const { Team } = require("../schema/TeamSchema");

const createTeam = async (req, res) => {
    try {
      const form = new Team(req.body);
      await form.save();
      return res
        .status(201)
        .json({ ok: true, message: "Team Created Successfully." });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error saving form data");
    }
  }

  const getTeamsById = async (req, res) => {
    try {
      const teams = await Team.find({ id: req.params.id });
      res.send(teams);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error retrieving form data");
    }
  }

  const updateTeam = async (req, res) => {
    try {
      const form = await Team.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: req.body.status,
          },
        }
      );
      if (form.modifiedCount > 0) {
        return res
          .status(200)
          .send(
            `Team is ${req.body.status ? "Un-archive" : "Archive"} successfully.`
          );
      } else {
        return res.status(404).send("Form not found");
      }
    } catch (err) {
      return res.status(500).send("Error deleting form data");
    }
  }

  module.exports = {
    createTeam,
    getTeamsById,
    updateTeam
  }