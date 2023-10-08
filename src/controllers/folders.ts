import { Request, Response } from "express";
import { Folder } from "../Schema/FolderSchema";


export const createFolder = async (req: Request, res: Response) => {
  const newFolder = new Folder(req.body);
  try {
    await newFolder.save();
    res.status(200).json({ ok: true, message: "Folder Created." });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getFolderById = async (req: Request, res: Response) => {
  try {
    const folders = await Folder.find({ id: req.params.id });
    return res.json(folders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getoFolderContent = async (req: Request, res: Response) => {
  try {
    const folders = await Folder.find({ _id: req.params.id });
    return res.json(folders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  const r = await Folder.deleteOne({ _id: req.params.id });
  if (r.deletedCount > 0) {
    return res.json({ ok: true, message: "Folder Deleted." });
  } else {
    res.json({ ok: false, message: "Failed to delete folder" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const r = await Folder.findOne({ _id: req.params.folderId });

  const result = r?.files.filter((file: any) => file._id != req.params.id);
  const query = await Folder.updateOne(
    { _id: req.params.folderId },
    {
      $set: {
        files: result,
      },
    },
  );
  if (query.modifiedCount > 0) {
    return res.json({ ok: true, message: "File Deleted" });
  } else {
    return res.json({ ok: false, message: "Failed to delete file" });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const form: any = await Folder.updateOne(
      { _id: req.body.id },
      {
        $push: {
          files: req.body.payload,
        },
      },
    );
    if (form.modifiedCount < 0) {
      res.status(404).json({ ok: false });
    } else {
      res.status(200).json({ ok: true });
    }
  } catch (err) {
    res.status(500).send("Error deleting form data");
  }
};
