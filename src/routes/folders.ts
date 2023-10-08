import express from "express";
import {
  createFolder,
  getFolderById,
  getoFolderContent,
  deleteFolder,
  uploadDocument,
  deleteFile,
} from "../controllers/folders";

const router = express.Router();

router.post("/create-folder", createFolder);
router.get("/:id", getFolderById);
router.get("/getFolderContents/:id", getoFolderContent);
router.delete("/folders/:id", deleteFolder);
router.delete("/file/:folderId/:id", deleteFile);
router.post("/document", uploadDocument);

export default router;
