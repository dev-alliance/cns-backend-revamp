const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {Product} = require('../Schema/ProductSchema')


router.post('/add-product',async (req,res)=> {
    console.log(req.body)

        const products = new Product(req.body)
        await products.save();
      
        return res.json({message:"Product Created Successfull"});
  })

  


  module.exports = router;