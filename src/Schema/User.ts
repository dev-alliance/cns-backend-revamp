import mongoose from "mongoose";

export interface IUserDocument {
  id:string,
  firstName:string,
  lastName:string,
  job:string,
  team:string,
  landline:string,
  mobile:string,
  email:string,
  password:string,
  role:number,
  emailVerified:boolean,
  image:string,
  status:boolean,
  disabled:boolean

}

/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - id
 *        - firstName
 *        - lastName
 *        - job
 *        - team
 *        - landline
 *        - mobile
 *        - email
 *        - password
 *        - role
 *        - emailVerified
 *        - image
 *        - status
 *        - disabled
 *      properties:
 *        id:
 *          type: string
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        job:
 *          type: string
 *        team:
 *          type: object
 *        landline:
 *          type: string
 *        mobile:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        role:
 *          type: string
 *        emailVerified:
 *          type: boolean
 *        image:
 *          type: string
 *        status:
 *          type: boolean
 *        disabled:
 *          type: boolean
 *    UserResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const userSchema = new mongoose.Schema<IUserDocument>(
  {
    id: String,
    firstName: String,
    lastName: String,
    job: String,
    team: {},
    landline: String,
    mobile: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
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
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("cns.users", userSchema);

