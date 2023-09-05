const express = require("express");
const { User } = require("../Schema/CNS/UserSchema");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const { Branch } = require("../Schema/CNS/BranchSchema");
const { Folder } = require("../Schema/CNS/FolderSchema");
const { Team } = require("../Schema/CNS/TeamSchema");
const { Normal } = require("../Schema/CNS/Normal");
const { Clauses } = require("../Schema/CNS/Clauses");
const { Templates } = require("../Schema/CNS/TemplateSchema");
const { Tag } = require("../Schema/CNS/Tags");
const { CustomField } = require("../Schema/CNS/customFields");
const { Permissions } = require("../Schema/CNS/Permissions");
const nodemailer = require("nodemailer");
const path = require("path");

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

    return res.json({ ok: true, message: "Please login to continue." });

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


  const t = await Normal.findOne({email:req.body.email}).where({id:req.body.id})



  if(t)  {
    return res.json({ok:false,message:"User already exits."})
  }

  try {
    const user = new Normal(req.body);

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
  // if (!user.emailVerified) {
  //   return res.json({ ok: false, message: "Please verify Email address." });
  // }
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
router.get("/forms/:id", async (req, res) => {
  try {
    const forms = await Branch.find({ id: req.params.id });
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

router.get("/folders/:id", async (req, res) => {
  try {
    const folders = await Folder.find({ id: req.params.id });
    return res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/getFolderContents/:id", async (req, res) => {
  console.log("htting >>");
  try {
    const folders = await Folder.find({ _id: req.params.id });
    return res.json(folders);
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

router.delete("/folders/:id", async (req, res) => {
  const r = await Folder.deleteOne({ _id: req.params.id });
  console.log(r);
  if (r.deletedCount > 0) {
    return res.json({ ok: true, message: "Folder Deleted." });
  } else {
    res.json({ ok: false, message: "Failed to delete folder" });
  }
});

router.delete("/file/:folderId/:id", async (req, res) => {
  const r = await Folder.findOne({ _id: req.params.folderId });

  const result = r.files.filter((file) => file._id != req.params.id);
  const query = await Folder.updateOne(
    { _id: req.params.folderId },
    {
      $set: {
        files: result,
      },
    }
  );
  console.log(query);

  if (query.modifiedCount > 0) {
    return res.json({ ok: true, message: "File Deleted" });
  } else {
    return res.json({ ok: false, message: "Failed to delete file" });
  }
});

router.post("/document", async (req, res) => {
  console.log(req.body);
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

router.post("/create-template", async (req, res) => {
  try {
    const r = new Templates(req.body);
    await r.save();
    return res.json({ ok: true, message: "Template upload successfully." });
  } catch (err) {
    return res.json({ ok: false, message: "Failed to upload template" });
  }
});

router.post("/update-password", async (req, res) => {
  const { newPassword, old } = req.body;
  const user = await User.findOne({ _id: req.body.id });
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
});

router.get("/templates/:id", async (req, res) => {
  console.log(req.body);
  try {
    const r = await Templates.find({ id: req.params.id });
    return res.json({ ok: true, data: r });
  } catch (err) {
    return res.json({ ok: false, message: "Failed to load template" });
  }
});

router.get("/delete-template/:id", async (req, res) => {
  console.log(req.body);
  try {
    const r = await Templates.deleteOne({ _id: req.params.id });
    if (r.deletedCount > 0) {
      return res.json({ ok: true, data: r, message: "Template deleted" });
    } else {
      return res.json({ ok: false, data: r, message: "Something went wrong" });
    }
  } catch (err) {
    return res.json({ ok: false, message: "Failed to load template" });
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
router.get("/teams/:id", async (req, res) => {
  try {
    const forms = await Team.find({ id: req.params.id });
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const forms = await Normal.find({ id: req.params.id });
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});

router.get("/disable-user/:id/:status", async (req, res) => {
  try {
    const forms = await Normal.updateOne(
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
});

router.get("/user-status/:stat", async (req, res) => {
  try {
    const forms = await Normal.find({ id: req.params.id });
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

router.post("/create-clauses", async (req, res) => {
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
});

router.get("/clauses/:id", async (req, res) => {
  try {
    const forms = await Clauses.find({ id: req.params.id });
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});
// tags
router.post("/create-tag", async (req, res) => {
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
});

router.get("/tag/:id", async (req, res) => {
  try {
    const forms = await Tag.find({ id: req.params.id });
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});

// custom fields

router.post("/create-custom-field", async (req, res) => {
  try {
    const form = new CustomField(req.body);
    await form.save();
    return res
      .status(201)
      .json({ ok: true, message: "Custom Field Created." });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error saving form data");
  }
});

router.get("/custom-field/:id", async (req, res) => {
  try {
    const forms = await CustomField.find({ id: req.params.id });
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});

router.delete("/custom-field/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    await CustomField.deleteOne({ _id: req.params.id });
    return res.status(200).send({ ok: true, message: "Custom Field Deleted." });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});

router.delete("/clauses/:id", async (req, res) => {
  try {
    const forms = await Clauses.deleteOne({ _id: req.params.id });
    if (forms.deletedCount > 0) {
      return res.json({ ok: true, message: "Clause Deleted." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
});

router.post("/create-permission", async (req, res) => {
  try {
    const permissions = new Permissions(req.body);
    await permissions.save();
    return res.json({ ok: true, message: "Role created successfully." });
  } catch (err) {
    return res.json({ ok: false, message: "Failed to add roles & permission" });
  }
});

router.get("/permissions/:id", async (req, res) => {
  try {
    const permissions = await Permissions.find({ id: req.params.id }).select(
      "-permissions"
    );
    return res.json({ ok: true, data: permissions });
  } catch (err) {
    return res.json({
      ok: false,
      message: "Failed to load add roles & permission",
    });
  }
});
router.delete("/permission/:id", async (req, res) => {
  try {
    const permissions = await Permissions.deleteOne({ _id: req.params.id });
    if (permissions.deletedCount > 0) {
      return res.json({ ok: true, message: "Role delete successfully." });
    }
  } catch (err) {
    return res.json({
      ok: false,
      message: "Failed to delete roles & permission",
    });
  }
});




module.exports = router;
