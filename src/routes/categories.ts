import express from "express";

import {
  DeleteCategory,
  DisableCategory,
  EditCategory,
  create,
} from "../controllers/categories";

const router = express.Router();

router.post("/create", create);

router.post("/:id", EditCategory);

router.patch("/:id", DisableCategory);

router.delete("/:id", DeleteCategory);

export default router;
