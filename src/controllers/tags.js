const { Tag } = require("../schema/Tags");

const createTag = async (req, res) => {
    try {
      const form = new Tag(req.body);
      await form.save();
      return res
        .status(201)
        .json({ ok: true, message: "Tag Created Successfully." });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error saving form data");
    }
  }

  const getTags = async (req, res) => {
    try {
      const forms = await Tag.find({ id: req.params.id });
      res.send(forms);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error retrieving form data");
    }
  }

  module.exports = {
    createTag,
    getTags
  }