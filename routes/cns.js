const express = require("express");
const { User } = require("../Schema/CNS/UserSchema");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const { Branch } = require("../Schema/CNS/BranchSchema");
const { Folder } = require("../Schema/CNS/FolderSchema");
const { Team } = require("../Schema/CNS/TeamSchema");
const { Normal } = require("../Schema/CNS/Normal");

sgMail.setApiKey(
  "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"
);

router.get("/", async (req, res) => {
  return res.send("ok");
});

router.post("/create-user", async (req, res) => {
  const usr = await User.findOne({ email: req.body.email });
  if (usr) {
    return res.json({ ok: false, message: "user already exits." });
  }
  try {
    const user = new User(req.body);
    user.save();

    const msg = {
      to: req.body.email, // Change to your recipient
      from: "syedmohi04@gmail.com", // Change to your verified sender
      subject: "ContractnSign Email Verification",
      text: "Please verify your email address",
      templateId: "d-42ad1dfe6e9c4e0f84633588614fb44c",
      dynamicTemplateData: {
        url: `http://localhost:3000/email-verify/${user._id}`,
      },
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        return res.status(200).json({
          ok: true,
          message: "Please check your email to activate your account.",
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(200).json({ ok: false });
      });
  } catch (err) {
    return res
      .status(200)
      .json({ ok: false, message: "failed to create user" });
  }
});

router.post("/add-user", async (req, res) => {
  const usr = await Normal.findOne({ email: req.body.email });
  if (usr) {
    return res.json({ ok: false, message: "user already exits." });
  }
  try {
    const user = new Normal(req.body);
    user.save();
    return res.json({ ok: true, message: "User created successfully." });
  } catch (err) {
    return res
      .status(200)
      .json({ ok: false, message: "failed to create user" });
  }
});

router.post("/verify-email", async (req, res) => {
  const usr = await User.updateOne(
    { _id: req.body.id },
    {
      $set: {
        emailVerified: true,
      },
    }
  );
  if (usr.modifiedCount > 0) {
    return res.json({
      ok: true,
      message: "Email Verified. Please continue to login",
    });
  } else {
    return res.json({ ok: false, message: "email cannot be verified" });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.json({ ok: false, message: "Invalid username or password." });
  }

  if (!user.emailVerified) {
    return res.json({ ok: false, message: "Please verify Email address." });
  }

  if (user.password != req.body.password) {
    return res.json({ ok: false, message: "Password is incorrect." });
  }

  return res.json({ ok: true, user });
});

router.post("/create-branch", async (req, res) => {
  try {
    const form = new Branch(req.body);
    await form.save();
    return res
      .status(201)
      .json({ ok: true, message: "Branch Created Successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error saving form data");
  }
});

// Define the route to get all form submissions
router.get("/forms", async (req, res) => {
  try {
    const forms = await Branch.find();
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});

// Define the route to delete a form submission by ID
router.post("/forms/:id", async (req, res) => {
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
      res.status(404).send("Form not found");
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
    res.status(500).send("Error deleting form data");
  }
});

router.post("/create-folder", async (req, res) => {
  const submission = new Folder(req.body);

  try {
    await submission.save();
    res.status(201).json({ ok: true, message: "Folder Created." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/folders", async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getFolder(req, res, next) {
  let folder;
  try {
    folder = await Folder.findById(req.params.id);
    if (folder == null) {
      return res.status(404).json({ message: "Folder not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.folder = folder;
  next();
}

router.delete("/folders/:id", getFolder, async (req, res) => {
  try {
    await res.folder.remove();
    return res.status(200).send("Folder Deleted.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/document", async (req, res) => {
  console.log(req.body)
  try {
    const form = await Folder.updateOne(
      { _id: req.body.id },
      {
        $push: {
          files: req.body.payload,
        },
      }
    );
    console.log(!form.modifiedCount > 0, form.modifiedCount);
    if (!form.modifiedCount < 0) {
      res.status(404).json({ ok: false });
    } else {
      res.status(200).json({ ok: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting form data");
  }
});

router.get("/folders/:id", getFolder, (req, res) => {
  res.json(res.folder);
});

router.post("/create-team", async (req, res) => {
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
});

// Define the route to get all form submissions
router.get("/teams", async (req, res) => {
  try {
    const forms = await Team.find();
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});

router.get("/users", async (req, res) => {
  try {
    const forms = await Normal.find();
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});

router.post("/team/:id", async (req, res) => {
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
});

router.delete("/user/:id", async (req, res) => {
  try {
    const form = await Normal.deleteOne({ _id: req.params.id });
    if (form.deletedCount > 0) {
      return res.status(200).send(`User Deleted.`);
    } else {
      return res.status(404).send("User not found");
    }
  } catch (err) {
    return res.status(500).send("Error deleting user");
  }
});

module.exports = router;
