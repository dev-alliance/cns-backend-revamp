require("dotenv").config();
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const _ = require("lodash");
const sgMail = require("@sendgrid/mail");
const pdfInvoice = require("pdf-invoice");

const bcrypt = require("bcrypt");
const { User, validate } = require("../Schema/UserSchema");
sgMail.setApiKey(
  "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"
);
const { Orders, validateOrders } = require("../Schema/OrderSchema");
const jwt = require("jsonwebtoken");
const config = require("config");
const s3 = require("../s3");
const { Product } = require("../Schema/ProductSchema");
const { ProductReview } = require("../Schema/ProductReview");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");
const { Deliveryapp } = require("../Schema/DeliveryAppSchema");
const { Category } = require("../Schema/Categories");
const { Cost } = require("../Schema/Cost");
const { result } = require("lodash");
// Read HTML Template
var html = fs.readFileSync(path.resolve(__dirname, "../template.html"), "utf8");

var razor = new Razorpay({
  key_id: "rzp_test_qxsRuZfigMmu3O",
  key_secret: "GyT6kJjJfDSt4b318RN56JTP",
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

  if (error)
    return res
      .status(400)
      .json({ ok: false, message: error.details[0].message });
  console.log(error);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({ ok: false, message: "User already exits" });

  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  const result = _.pick(user, ["_id", "email", "username"]);
  return res.header("x-auth-token", token).send(result);
});

router.post("/createOrder", auth, async (req, res) => {
  // const {error} = validateOrders({...req.body.info,order:req.body.order})
  const user = await User.findById(req.user._id).select("-password");
  // if (error) return res.json({status:400,message:error.details[0].message});

  order = new Orders({ ...req.body, userid: user._id });

  await order.save();

  return res.json({ ...req.body, userid: user._id });
  // console.log({ ...req.body, userid: user._id })
});

router.post("/update", async (req, res) => {
  const query = { _id: req.body._id };
  console.log(query);

  const r = await Product.findOne({ _id: req.body._id });
  const updateDocument = {
    $set: req.body,
  };
  const result = await Product.updateOne(query, updateDocument);
  if (result.modifiedCount > 0) {
    return res.status(200).json({ ok: true, message: "Updated", result });
  } else {
    return res.status(200).json({ ok: false, message: "failed", result });
  }
  // console.log({ ...req.body, userid: user._id })
});

router.post("/update-category", async (req, res) => {
  const query = { _id: req.body._id };
  console.log(query);

  const r = await Category.findOne({ _id: req.body._id });
  const updateDocument = {
    $set: { name: req.body.name },
  };
  const result = await Category.updateOne(query, updateDocument);
  if (result.modifiedCount > 0) {
    return res.status(200).json({ ok: true, message: "Updated", result });
  } else {
    return res.status(200).json({ ok: false, message: "failed", result });
  }
  // console.log({ ...req.body, userid: user._id })
});

router.post("/request-cancellation", async (req, res) => {
  console.log(req.body.id);
  const result = await Orders.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { orderStatus: 4 } }
  );

  return res
    .status(200)
    .json({ ok: true, message: "Request is in process.", result: result });
});

router.get("/s3url", async (req, res) => {
  const url = await s3.generateUploadURL();
  res.send({ url });
});
router.get("/health", async (req, res) => {
  return res.status(200).send("OK");
});
router.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});
router.get("/search", async (req, res) => {
  console.log(req.query, "search >> ");
  if (req.query.q) {
    const products = await Product.find({ $text: { $search: req.query.q } });
    return res.status(200).json({ results: products });
  }
});

router.get("/filter", async (req, res) => {
  console.log(req.query, "search >> ");
  if (req.query.q || req.query.price) {
    const categories = await Product.find({
      category: req.query.q,
      price: { $gte: req.query.price },
    });
    return res.status(200).json({ ok: true, results: categories });
  }
});

router.get("/orders", auth, async (req, res) => {
  const orders = await Orders.find({ userid: req.user._id }).sort({
    date: -1,
  });
  res.json(orders);
});

router.get("/all-orders", async (req, res) => {
  const results = await Orders.find({}).where({ orderStatus: { $in: [1, 2] } });
  if (results.length > 0) {
    return res.status(200).json({ ok: true, data: results });
  }

  return res.status(200).json({ ok: true, data: [], message: "No Results" });
});

router.get("/cancelled", async (req, res) => {
  const results = await Orders.find({}).where({ orderStatus: 4 });
  if (results.length > 0) {
    return res.status(200).json({ ok: true, data: results });
  }

  return res.status(200).json({ ok: true, data: [], message: "No Results" });
});

// router.get("/delete-address", auth, async (req, res) => {
//   const users = await User.find({ userid: req.user._id });
//   console.log(users);
//   res.json(users);
// });

router.post("/add-address", auth, async (req, res) => {
  const query = { _id: req.user._id };
  console.log(query);
  const updateDocument = {
    $set: { address: req.body },
  };
  const result = await User.updateOne(query, updateDocument);
  console.log(result);
  if (result.acknowledged) {
    return res
      .status(200)
      .json({ ok: true, message: "Address Added Successfully" });
  } else {
    return res
      .status(400)
      .json({ ok: false, message: "Failed to add address" });
  }
});

router.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

router.post("/razorpay", async (req, res) => {
  const { amount, name, mobile } = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: shortid.generate(),
  };
  try {
    const response = await razor.orders.create(options);
    res.send({
      name,
      mobile,
      totalAmount: amount,

      amount: response.amount,
      currency: response.currency,
      receipt: response.receipt,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/pdf", async (req, res) => {
  const order = await Orders.findOne({ _id: req.body.id });
  const document = pdfInvoice({
    company: {
      phone: "(99) 9 9999-9999",
      email: "info@natmarts.com",
      address: "195 Broaddus Maple Court Avenue, United States of America",
      name: "Natmarts",
    },
    customer: {
      name: order.firstname,
      email: order.email,
      address: order.address,
      country: order.country,
      date: order.date,
    },
    items: [
      {
        amount: 50.0,
        name: "XYZ",
        description: "Lorem ipsum dollor sit amet",
        quantity: 12,
      },
      {
        amount: 12.0,
        name: "ABC",
        description: "Lorem ipsum dollor sit amet",
        quantity: 12,
      },
      {
        amount: 127.72,
        name: "DFE",
        description: "Lorem ipsum dollor sit amet",
        quantity: 12,
      },
    ],
  });

  // That's it! Do whatever you want now.
  // Pipe it to a file for instance:

  const fs = require("fs");

  document.generate(); // triggers rendering
  document.pdfkitDoc.pipe(fs.createWriteStream("file.pdf"));
});

router.get("/get-reviews/:id", async (req, res) => {
  const results = await ProductReview.find({ id: req.params.id });
  res.json(results);
});

router.post("/update-address", auth, async (req, res) => {
  console.log(req.body);
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { defaultAddress: { formValues: req.body } } }
  );
  await user.save();

  res.json({ ok: true });
});

router.get("/delete-address", auth, async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { defaultAddress: {} } }
  );
  await user.save();

  res.json({ ok: true });
});

router.post("/shippingCost", async (req, res) => {

  const result = await Cost.findOne({name:req.body.name})
 console.log(result,req.body)
  if(result) {
    return res.status(200).json({ok:false,message:"State Already Exists"})
  }

  try {
    const re = new Cost(req.body);
    await re.save();
    return res.status(200).json({ ok: true, message: "Pricing Added" });
  } catch (err) {
    return res
      .status(200)
      .json({ ok: false, message: "failed to add product" });
  }
});

router.get("/get-shippingCost",async(req,res)=> {
  const results = await Cost.find();
  return res.status(200).json({ok:true,data:results})
})

router.delete("/delete-pricing/:id",async(req,res)=> {
  
  const results = await Cost.deleteOne({_id:req.params.id})
  return res.status(200).json({ok:true,data:results})
})

router.post("/update-billing", auth, async (req, res) => {
  const userD = await User.findOne({ _id: req.user._id });
  const resss = { ...userD.defaultAddress.formValues, ...req.body };

  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { defaultAddress: { formValues: resss } } }
    );
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(200).json({ ok: false });
  }
});

router.post("/update-profile", auth, async (req, res) => {
  console.log(req.body);

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { username: req.body.username, mobile: req.body.mobile } }
  );
  await user.save();

  res.json({ ok: true });
});

router.post("/change-password", async (req, res) => {
  console.log(req.body);
  const user = await User.findById({ _id: req.body.id });

  const salt = await bcrypt.genSalt(10);
  let np = await bcrypt.hash(req.body.password, salt);

  User.updateOne({ email: user.email }, { $set: { password: np } })
    .then(() =>
      res.json({ ok: true, message: "Password Changed Successfully" })
    )
    .catch(() =>
      res.json({ ok: false, message: "Error while changing password" })
    );

  return res.status(200);
});

router.post("/reset", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ ok: false, message: "User not found " });

  const msg = {
    to: "sdfahad729@gmail.com", // Change to your recipient
    from: "syedmohi04@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    templateId: "d-42ad1dfe6e9c4e0f84633588614fb44c",
    dynamicTemplateData: {
      url: `http://localhost:3000/reset/${user._id}`,
    },
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return res.status(200).json({
        ok: true,
        message:
          "Thanks! If there's an account associated with this email, we'll send the password reset instructions immediately.",
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(200).json({ ok: false });
    });
});

router.post("/app-register", async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const newUser = new Deliveryapp({ ...req.body, password: hashPassword });
    await newUser.save();
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err.message);
    return res.status(200).json({ ok: false });
  }
});

router.post("/app-login", async (req, res) => {
  const user = await Deliveryapp.findOne({ user: req.body.user });
  if (!user) return res.status(404).send("Invalid user or password");

  const hashPassword = await bcrypt.compare(req.body.password, user.password);

  if (hashPassword) {
    return res.status(200).json({ ok: true });
  }
});

router.post("/app-cancellation", async (req, res) => {
  try {
    const result = await Orders.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { orderStatus: req.body.status } }
    );

    return res
      .status(200)
      .json({ ok: true, message: "Status Changed.", result: result });
  } catch (err) {
    return res.status(400).json({
      ok: true,
      message: "Server Error, Please try again",
      result: result,
    });
  }
});

router.get("/search-order/:id", async (req, res) => {
  try {
    const order = await Orders.findOne({ _id: req.params.id });
    return res.status(200).send(order);
  } catch (err) {
    return res.status(404).send("Invalid Order ID");
  }
});

module.exports = router;
