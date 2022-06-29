require("dotenv").config();
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../Schema/UserSchema");
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
    return res.json({ status: 400, message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.json({ status: 400, message: "User already exits" });

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
});

router.post("/request-cancellation", async (req, res) => {
  console.log(req.body.id)
  const result = await Orders.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { orderStatus: 4 } }
  );
 
    return res
      .status(200)
      .json({ ok: true, message: "Request is in process." , result:result});
  
  });

router.get("/s3url", async (req, res) => {
  const url = await s3.generateUploadURL();
  res.send({ url });
});

router.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});
router.get("/search", async (req, res) => {
  console.log(req.query, "search >> ");
  if (req.query.q) {
    const products = await Product.find({ $text: { $search: req.query.q } });
    return res.status(200).json({ results: products });
  }
});

router.get("/orders", auth, async (req, res) => {
  const orders = await Orders.find({ userid: req.user._id });
  res.json(orders);
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
  console.log(req.params);
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
  const orders = await Orders.find({
    order: { $elemMatch: { id: req.body.id } },
  });
  var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "45mm",
      contents: '<div style="text-align: center;">Author: Shyam Hajare</div>',
    },
    footer: {
      height: "28mm",
      contents: {
        first: "Cover page",
        2: "Second page", // Any page number is working. 1-based index
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: "Last Page",
      },
    },
  };

  pdf
    .create(
      {
        html: html,
        data: {
          data: orders,
        },
        path: "./output.pdf",
        type: "",
      },
      options
    )
    .then((resp) => {
      res.json(resp);
    })
    .catch((error) => {
      res.json(error);
    });
});
router.post("/post-review", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const result = { id: user._id, name: user.username, ...req.body };

  const review = await ProductReview(result);
  await review.save();

  res.json(result);
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

router.post("/update-billing", auth, async (req, res) => {
  console.log(req.body);
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { defaultAddress: { formValues: req.body } } }
  );
  await user.save();

  res.json({ ok: true });
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

router.post("/change-password", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.json({ status: 400, message: "Incorrect passsword", ok: false });

  const salt = await bcrypt.genSalt(10);
  let np = await bcrypt.hash(req.body.newPassword, salt);

  User.updateOne({ email: user.email }, { $set: { password: np } })
    .then(() =>
      res.json({ ok: true, message: "Password Changed Successfully" })
    )
    .catch(() =>
      res.json({ ok: false, message: "Error while changing password" })
    );
});

router.get("/mail", async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "postmaster@sandbox1e9880cca1b64859b9166d7beaa10841.mailgun.org", // generated ethereal user
      pass: "cd3f46ffdb7431cab0cabc05333187c1-77985560-0daf2770", // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: "postmaster@sandbox1e9880cca1b64859b9166d7beaa10841.mailgun.org", // sender address
    to: "syedmohi04@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    body: "some text",
  });

  console.log("Message sent: %s", info.messageId);
});

module.exports = router;
