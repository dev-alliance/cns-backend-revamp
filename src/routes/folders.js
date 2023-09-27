const express = require("express");
const router = express.Router();
const {
  createFolder,
  getFolderById,
  getoFolderContent,
  deleteFolder,
  uploadDocument,
  deleteFile,
} = require("../controllers/folders");

router.post("/create-folder", createFolder);
router.get("/:id", getFolderById);
router.get("/getFolderContents/:id", getoFolderContent);
router.delete("/folders/:id", deleteFolder);
router.delete("/file/:folderId/:id",deleteFile);
router.post("/document", uploadDocument);

module.exports = router;
