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
    return res.status(500).send("Failed to create clauses.");
  }
};

const getClausesById = async (req, res) => {
  try {
    const forms = await Clauses.find({ id: req.params.id });
    res.status(200).send(forms);
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to retrieving clauses data.");
  }
};

const deleteClauses = async (req, res) => {
  try {
    const forms = await Clauses.deleteOne({ _id: req.params.id });
    if (forms.deletedCount > 0) {
      return res.json({ ok: true, message: "Clause Deleted Successfully." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to delete clauses.");
  }
};
module.exports = {
  createClauses,
  getClausesById,
  deleteClauses,
};
