import express from "express";
import {
  createOrUpdateRole,
  deleteRole,
  getAllRole,
  getRoleById,
} from "../controllers/role";

const router = express.Router();

router.post("/createOrUpdateRole", async (req, res) => {
  try {
    const { name, createdByName, permissions, id } = req.body;

    if (!name || !permissions) {
      return res.status(400).json({
        error: "Name and permissions are required in the request body",
      });
    }

    await createOrUpdateRole(
      id,
      name,
      createdByName,
      permissions,
      req.body.desc
    );

    // Send a success response
    if (id) {
      res.status(200).json({
        ok: true,
        message: `Role ${name} updated successfully`,
      });
    } else {
      res.status(200).json({
        ok: true,
        message: `Role ${name} created successfully`,
      });
    }
  } catch (err: any) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "A role with this name already exists.",
      });
    }
    return res.status(500).send("Failed ");
  }
});
router.get("/list-role", getAllRole);

router.get("/:id", getRoleById);

router.delete("/:id", deleteRole);
export default router;
