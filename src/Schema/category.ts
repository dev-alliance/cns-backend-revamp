import mongoose from "mongoose";

interface SubCategory {
  name: string;
}

interface Category extends Document {
  id: string;
  name: string;
  status: string;
  subCategories: SubCategory[];
}

const subCategorySchema = new mongoose.Schema<SubCategory>({
  name: String,
});

const categorySchema = new mongoose.Schema<Category>({
  id: String,
  name: String,
  status: { type: String, default: "active" },
  subCategories: [subCategorySchema],
});

export const Categories = mongoose.model("cns.categories", categorySchema);
