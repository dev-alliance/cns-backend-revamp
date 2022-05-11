require("dotenv").config();
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../Schema/UserSchema");
const {Orders,validateOrders} = require('../Schema/OrderSchema')
const jwt = require("jsonwebtoken");
const config = require("config");
const s3 = require('../s3');
const { Product } = require("../Schema/ProductSchema");
const Razorpay = require('razorpay')
const shortid = require('shortid');

var razor = new Razorpay({
  key_id: "rzp_test_qxsRuZfigMmu3O",
  key_secret: "GyT6kJjJfDSt4b318RN56JTP"
});

router.get("/", auth, async (req, res) => {
  const results = await User.find();
  res.send(results);
});

router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/createUser", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.json({status:400,message:error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.json({status:400,message:"User already exits"});

  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  const result = _.pick(user, ["_id", "email", "username"]);
  return res.header("x-auth-token", token).send(result);
});

router.post("/createOrder", auth, async (req,res)=> {
  // const {error} = validateOrders({...req.body.info,order:req.body.order})
  const user = await User.findById(req.user._id).select("-password");
  // if (error) return res.json({status:400,message:error.details[0].message});

  order = new Orders({...req.body,_id:user._id})
  await order.save();

  return res.json({...req.body,userid:user._id});
  
})

router.get('/s3url',async (req,res)=> {
  const url = await s3.generateUploadURL()
  res.send({url})
})



router.get("/products",async(req,res)=> {
  const products = await Product.find({})
  res.json(products
    )
})

router.get("/orders",auth,async (req,res)=> {
 
  const orders = await Orders.findById({_id:req.user._id})
  res.json(orders)
})

router.get('/product/:id',async (req,res)=> {
  console.log(req.params)
  const product = await Product.findById(req.params.id)
  res.json(product)
})

// router.get('/orders',async(req,res)=> {
//   const orders = await Orders.findById(req.user._id).select("-password");
//   res.send(orders)
// })

router.post("/razorpay", async (req, res) => {
  const { amount, name, mobile} = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: shortid.generate(),
    
  }
  try {
    const  response = await razor.orders.create(options);
    res.send({
      name,
      mobile,
      totalAmount: amount,
      
      amount: response.amount,
      currency: response.currency,
      receipt: response.receipt,
    });
  }catch(error) {
    console.log(error)
  }
 
});

module.exports = router;
