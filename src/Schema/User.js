const mongoose = require("mongoose");


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
const userSchema = new mongoose.Schema({
  id:String,
  firstName: String,
  lastName: String,
  job: String,
  team: {},
  landline: String,
  mobile: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: 0, //root
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  image:String,
  status:{
    type:Boolean,
    default:true
  },
  disabled:{
    type:Boolean,
    default:false
  }

});

const User = mongoose.model("cns.users", userSchema);
exports.User = User;
