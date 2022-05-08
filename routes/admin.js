const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();


router.post('/add-product',async (req,res)=> {
    console.log(req.body)
  })


  module.exports = router;