const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const { Admin } = require("../Schema/Admin");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Product } = require("../Schema/ProductSchema");
const upload = multer({ dest: "uploads/" });
const { uploadFile } = require("../s3");
const _ = require("lodash");
const { Category } = require("../Schema/Categories");
router.post("/add-user", async (req, res) => {
  let admin = await Admin.findOne({ user: req.body.user });
  if (admin)
    return res.status(400).json({ ok: false, message: "User already exits" });

  admin = new Admin(req.body);
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
  await admin.save();

  const token = admin.generateAuthToken();
  const result = _.pick(admin, ["_id", "user"]);
  return res.header("x-auth-token", token).send({ ...result, ok: true });
});

router.post("/login", async (req, res) => {
  let admin = await Admin.findOne({ email: req.body.email });

  if (!admin)
    return res
      .status(200)
      .json({ ok: false, message: "Invalid user or password" });

  const validPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!validPassword)
    return res
      .status(200)
      .json({ ok: false, message: "Invalid user or password" });

  const token = admin.generateAuthToken();

  return res.json({ ok: true, token });
});

router.post("/add-product", async (req, res) => {
  console.log(req.body);

  const products = new Product(req.body);
  await products.save();

  return res.json({ ok: true, message: "Product Created Successfull" });
});

router.post("/remove-product", async (req, res) => {
  
  const result = await Product.deleteOne({_id:req.body.id})
  

  return res.json({ ok: true, message: "Product Deleted Successfull" });
});

router.post("/add-category", async (req, res) => {
  const category = new Category(req.body);
  await category.save();

  return res.json({ message: "Category Created Successfull", ok: true });
});

router.get("/get-category", async (req, res) => {
  const category = await Category.find({});
  return res.json({ data: category, ok: true });
});

router.post("/upload-action-files", upload.array("file",5), async (req, res) => {
    console.log(req.files);

    let rest = [];
    for(let i= 0; i<req.files?.length; i++) {
      try {
        const s = await uploadFile(req.files[i]);
        rest.push(s.Location);
      } catch (err) {
        return res.json({ok:false});
      }
    }
  
    return res.json({ok:true,data:rest})
    
  });

module.exports = router;
