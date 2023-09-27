const { Clauses } = require("../Schema/Clauses");

const createClauses = async (req, res) => {
  try {
    const form = new Clauses(req.body);
    await form.save();
    return res
      .status(201)
      .json({ ok: true, message: "Clauses Created Successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error saving form data");
  }
};

const getClausesById = async (req, res) => {
  try {
    const forms = await Clauses.find({ id: req.params.id });
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
};

const deleteClauses = async (req, res) => {
  try {
    const forms = await Clauses.deleteOne({ _id: req.params.id });
    if (forms.deletedCount > 0) {
      return res.json({ ok: true, message: "Clause Deleted." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
};
module.exports = {
  createClauses,
  getClausesById,
  deleteClauses,
};
