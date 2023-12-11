import mongoose from "mongoose";
// import crypto from "crypto";
export const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IHistory {
  Date: Date;
}

export interface IUserDocument {
  id: string;
  firstName: string;
  lastName: string;
  job: string;
  team: mongoose.Schema.Types.ObjectId;
  landline: string;
  mobile: string;
  email: string;
  password: string;
  role: number;
  emailVerified: boolean;
  image: string;
  status: string;
  loginHistory: [IHistory];
  disabled: boolean;
  twoFactorAuth: boolean;
  branch: mongoose.Schema.Types.ObjectId;
  failedLoginAttempts: number;
  lockUntil: Date;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
}

const loginHistorySchema = new mongoose.Schema<IHistory>(
  {
    Date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    id: String,
    firstName: {
      type: String,
      // required: [true, "PLease Enter Your Name"],
      maxLength: [30, "Max length Exceeded"],
      minLength: [2, "Min 2 characters in firstname"],
    },
    lastName: {
      type: String,
      // required: [true, "PLease Enter Your Name"],
      maxLength: [30, "Max length Exceeded"],
      minLength: [2, "Min 2 characters in lastname"],
    },
    job: {
      type: String,
    },
    team: {
      ref: "cns.team",
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    landline: String,
    mobile: String,
    email: {
      type: String,
      required: [true, "PLease Enter Your Email"],
      unique: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          return emailRegexPattern.test(String(email));
        },
        message: "Please enter a valid email!",
      },
    },
    password: {
      type: String,
      minLength: [8, "Password should be greater then 10 character"],
      select: false,
    },
    loginHistory: {
      type: [loginHistorySchema],
      default: () => [],
    },
    role: {
      type: Number,
      default: 0, //root
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: String,
    status: {
      type: String,
      default: "Active",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },

    branch: {
      ref: "cns.branch",
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

//converting Email to LowerCase
userSchema.pre("save", async function (next) {
  if (!this.isModified("email")) {
    next();
  }

  this.email = this.email.toLowerCase();
});

//JWT TOKEN
userSchema.methods.getJWTToken = function () {
  console.log("test");

  return jwt.sign(
    { _id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

//Hashing Password Before Saving User
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
//Comparing Password for Login
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generating Password Reset Token
// userSchema.methods.getResetPasswordToken = function () {
//   //Generating Token
//   const resetToken = crypto.randomBytes(20).toString("hex");
//   //hashing and adding to user Schema
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
//   return resetToken;
// };

export const UserModel = mongoose.model("cns.users", userSchema);
