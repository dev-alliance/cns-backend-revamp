const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
});


const Category = mongoose.model("natmarts.categories", CategorySchema);
exports.Category = Category;
