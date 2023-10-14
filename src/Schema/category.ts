import mongoose from "mongoose";

interface SubCategory {
  name: string;
}

interface Category extends Document {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

const subCategorySchema = new mongoose.Schema<SubCategory>({
  name: String,
});

const categorySchema = new mongoose.Schema<Category>({
  id: String,
  name: String,
  subCategories: [subCategorySchema],
});

export const Categories = mongoose.model("cns.categories", categorySchema);
