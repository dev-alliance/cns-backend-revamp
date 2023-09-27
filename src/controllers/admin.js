const { Admin } = require("../Schema/Admin");

const createAdmin = async (req, res) => {
    const usr = await Admin.findOne({ email: req.body.email });
    if (usr) {
      return res.json({ ok: false, message: "user already exits." });
    }
  
    try {
      const user = new Admin(req.body);
      user.save();
  
      shortUrl.short(
        `http://localhost:3000/email-verify/${user._id}`,
        function (err, url) {
          console.log(url)
          const msg = {
            to: req.body.email, // Change to your recipient
            from: "syed@verzotechnologies.com", // Change to your verified sender
            subject: "ContractnSign Email Verification",
            html: "Please verify your email address",
            templateId: "d-dc474d7a24e443b48dcd7c5e8461c306",
            dynamicTemplateData: {
              url: url,
              name: req.body.email,
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
              console.error(error.response.body);
              return res.status(200).json({ ok: false });
            });
        }
      );
    } catch (err) {
      return res
        .status(200)
        .json({ ok: false, message: "failed to create user" });
    }
  }

  const verifyEmail = async (req, res) => {
    const usr = await Admin.updateOne(
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
      return res.json({ ok: false, message: "Unable to verfiy email address" });
    }
  }

const login = async (req, res) => {
    const user = await Admin.findOne({ email: req.body.email });
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
  }

  const updatePassword = async (req, res) => {
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
  }
  module.exports = {
    createAdmin,
    verifyEmail,
    login,
    updatePassword
  }