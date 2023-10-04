const { CustomField } = require("../schema/customFields");

const createCustomField = async (req, res) => {
    try {
      const form = new CustomField(req.body);
      await form.save();
      return res.status(201).json({ ok: true, message: "Custom Field Created." });
    } catch (err) {
      console.log(err);
      return res.status(400).send("Failed to create custom field");
    }
  }

  const getCustomFieldsById = async (req, res) => {
    try {
      const forms = await CustomField.find({ id: req.params.id });
      res.send(forms);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error retrieving form data");
    }
  }


  const deleteCustomFields = async (req, res) => {
    console.log(req.params.id);
    try {
      await CustomField.deleteOne({ _id: req.params.id });
      return res.status(200).send({ ok: true, message: "Custom Field Deleted." });
    } catch (err) {
      console.log(err);
      res.status(400).send("Failed to delete custom field");
    }
  }

  module.exports = {
    createCustomField,
    getCustomFieldsById,
    deleteCustomFields
  }
