const { User } = require("../Schema/User");

const createUser = async (req, res) => {
  const t = await User.findOne({ email: req.body.email }).where({
    id: req.body.id,
  });

  if (t) {
    return res.json({ ok: false, message: "User already exits." });
  }

  try {
    const user = new User(req.body);

    if (req.body.team) {
      const team = await Team.updateOne(
        { _id: req.body.team },
        {
          $push: {
            members: user,
          },
        }
      );

      if (team.modifiedCount > 0) {
        await user.save();
        return res.json({ ok: true, message: "User created successfully." });
      } else {
        return res.json({ ok: true, message: "Fail to create user." });
      }
    }
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "User Created successfully." });
  } catch (err) {
    return res
      .status(200)
      .json({ ok: false, message: "failed to create user" });
  }
};

const getUsersById = async (req, res) => {
  const { newPassword, old } = req.body;
  const user = await Admin.findOne({ _id: req.body.id });
  if (user.password == old) {
    const w = await User.updateOne(
      { _id: req.body.id },
      {
        $set: {
          password: newPassword,
        },
      }
    );
    if (w.modifiedCount > 0) {
      return res.json({ ok: true });
    } else {
      return res.json({ ok: false });
    }
  } else {
    return res.json({ ok: false, message: "Old password incorrect." });
  }
};

const disableUser = async (req, res) => {
  try {
    const forms = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.params.status,
        },
      }
    );
    if (forms.modifiedCount > 0) {
      return res.status(200).json({ ok: true, message: "User Status Changed" });
    } else {
      return res
        .status(200)
        .json({ ok: false, message: "Failed to change status." });
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({ ok: false, message: "Something went wrong" });
  }
};

const userStats = async (req, res) => {
    try {
      const forms = await User.find({ id: req.params.id });
      res.send(forms);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error retrieving form data");
    }
  }

  const deleteUser = async (req, res) => {
    try {
      const form = await User.deleteOne({ _id: req.params.id });
      if (form.deletedCount > 0) {
        return res.status(200).send(`User Deleted.`);
      } else {
        return res.status(404).send("User not found");
      }
    } catch (err) {
      return res.status(500).send("Error deleting user");
    }
  }

module.exports = {
  createUser,
  getUsersById,
  disableUser,
  userStats,
  deleteUser
};
