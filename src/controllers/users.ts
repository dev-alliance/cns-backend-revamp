import { Request, Response } from "express";
import { Team } from "./../Schema/Team";
import { UserModel as User } from "../Schema/User";

export const createUser = async (req: Request, res: Response) => {
  const t = await User.findOne({ email: req.body.email }).where({
    id: req.body.id,
  });

  if (t) {
    return res.status(422).json({ ok: false, message: "User already exits." });
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
        return res
          .status(200)
          .json({ ok: true, message: "User created successfully." });
      } else {
        return res
          .status(400)
          .json({ ok: true, message: "Fail to create user." });
      }
    }
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "User Created successfully." });
  } catch (err) {
    return res.status(400).json({ ok: false, message: "Fail to create user." });
  }
};

export const getUsersById = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ id: req.params.id });
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(400).send("failed to load users.");
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to load users.");
  }
};
export const disableUser = async (req: Request, res: Response) => {
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
      return res
        .status(200)
        .json({ ok: true, message: "User Status Changed." });
    } else {
      return res
        .status(422)
        .json({ ok: false, message: "Failed to update user status." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};

export const userStats = async (req: Request, res: Response) => {
  try {
    const forms = await User.find({ id: req.params.id });
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const form = await User.deleteOne({ _id: req.params.id });
    if (form.deletedCount > 0) {
      return res.status(200).send(`User Deleted.`);
    } else {
      return res.status(404).send("User not found");
    }
  } catch (err) {
    return res.status(400).send("Fail to delete user.");
  }
};
