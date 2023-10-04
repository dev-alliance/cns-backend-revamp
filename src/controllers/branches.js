const { Branch } = require("../schema/BranchSchema");

const createBranch = async (req, res) => {
  try {
    const form = new Branch(req.body);
    await form.save();
    return res
      .status(200)
      .json({ ok: true, message: "Branch Created Successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failed to create branch.");
  }
};

const getBranchById = async (req, res) => {
  try {
    const branches = await Branch.find({ id: req.params.id });
    res.send(branches);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form branches");
  }
};

const deleteBranchById = async (req, res) => {
  try {
    const form = await Branch.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      }
    );
    if (!form) {
      res.status(404).send("Branch not found.");
    } else {
      res
        .status(200)
        .send(
          `Branch is ${
            req.body.status ? "Un-archive" : "Archive"
          } successfully.`
        );
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to archive branch");
  }
};

module.exports = {
  createBranch,
  getBranchById,
  deleteBranchById,
};
