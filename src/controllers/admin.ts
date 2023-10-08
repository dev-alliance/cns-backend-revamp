import { validateAdminLogin } from "./../Schema/Admin";
// const shortUrl = require("node-url-shortener");
// import sgMail from "@sendgrid/mail";
import config from "config";
import { Request, Response } from "express";
import { UserModel as User } from "../Schema/User";
import bcrypt from "bcrypt";
import { Admin } from "../Schema/Admin";

export const createAdmin = async (req: Request, res: Response) => {
  const isAdminExists = await Admin.findOne({ email: req.body.email });
  if (isAdminExists) {
    return res.json({
      ok: false,
      message: "A User with this email already exits.",
    });
  }
  const admin = new Admin(req.body);

  const salt = await bcrypt.genSalt(config.get<number>("saltRound"));
  admin.password = await bcrypt.hash(admin.password, salt);

  await admin.save();
  return res.status(200).json({
    ok: true,
    message: "Account Created Successfully. Please login to continue",
  });

  // try {
  //   shortUrl.short(
  //     `http://localhost:3000/email-verify/${admin._id}`,
  //     function (err: object, url: string) {

  //       const msg = {
  //         to: req.body.email, // Change to your recipient
  //         from: "syed@verzotechnologies.com", // Change to your verified sender
  //         subject: "ContractnSign Email Verification",
  //         html: "Please verify your email address",
  //         templateId: "d-dc474d7a24e443b48dcd7c5e8461c306",
  //         dynamicTemplateData: {
  //           url: url,
  //           name: req.body.email,
  //         },
  //       };
  //       sgMail
  //         .send(msg)
  //         .then(async () => {
  //           console.log("Email sent");
  //           // Saving the user once email is sent to the user.
  //           await admin.save();
  //           return res.status(200).json({
  //             ok: true,
  //             message: "Please check your email to activate your account.",
  //           });
  //         })
  //         .catch((error: any) => {
  //           console.error(error.response.body);
  //           return res.status(200).json({ ok: false });
  //         });
  //     },
  //   );
  // } catch (err) {
  //   console.log(err);
  //   return res
  //     .status(200)
  //     .json({ ok: false, message: "failed to create user" });
  // }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const usr = await Admin.updateOne(
    { _id: req.body.id },
    {
      $set: {
        emailVerified: true,
      },
    },
  );
  if (usr.modifiedCount > 0) {
    return res.json({
      ok: true,
      message: "Email Verified. Please continue to login.",
    });
  } else {
    return res.json({ ok: false, message: "Unable to verfiy email address." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { error } = validateAdminLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return res
      .status(400)
      .json({ ok: false, message: "Invalid username or password." });
  }
  // if (!user.emailVerified) {
  //   return res
  //     .status(401)
  //     .json({ ok: false, message: "Please verify Email address." });
  // }

  const isPasswordValid = await admin.comparePassword(req.body.password);

  if (!isPasswordValid) return res.status(400).send("Invalid password");

  const token = admin.generateAuthToken();

  return res.status(200).json({ ok: true, token });
};

export const updatePassword = async (req: Request, res: Response) => {
  const { newPassword, old } = req.body;
  const user: any = await Admin.findOne({ _id: req.body.id });
  if (user.password == old) {
    const w = await User.updateOne(
      { _id: req.body.id },
      {
        $set: {
          password: newPassword,
        },
      },
    );
    if (w.modifiedCount > 0) {
      return res
        .status(200)
        .json({ ok: true, message: "Password changed successfully." });
    } else {
      return res
        .status(400)
        .json({ ok: false, message: "Failed to change password" });
    }
  } else {
    return res
      .status(401)
      .json({ ok: false, message: "Old password incorrect." });
  }
};
