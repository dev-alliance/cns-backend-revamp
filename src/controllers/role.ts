// Import necessary modules
import { Role } from "../Schema/Role";
import { Permission } from "../Schema/Permission";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const createOrUpdateRole = async (
  id: string | Types.ObjectId | null,
  name: string,
  createdByName: string,
  permissions: { [key: string]: boolean },
  desc: string
): Promise<void> => {
  let role: any;

  // If an ID is provided, try to find the role by ID
  if (id) {
    role = await Role.findById(id);
  }

  // If the role doesn't exist, create a new one
  if (!role) {
    role = new Role({ name, permissions: {} });
  }

  // Update permissions based on the provided values
  for (const permName in permissions) {
    let perm = await Permission.findOne({ name: permName });

    if (!perm) {
      perm = new Permission({ name: permName });
      await perm.save();
    }

    role.permissions.set(permName, permissions[permName]);
  }

  // Update role properties
  role.createdByName = createdByName;
  role.name = name;
  if (desc) {
    role.desc = desc;
  }

  // Save the role to the database
  await role.save();
};

export const getAllRole = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const role = await Role.find();
    res.send(role);
    // res.status(200).json({ ok: true, data: role });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve role.",
      error: error.message,
    });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).send("Role not found.");
    }

    res.status(200).send(role);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving role");
  }
};
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const forms = await Role.deleteOne({ _id: req.params.id });
    if (forms.deletedCount > 0) {
      return res.json({ ok: true, message: "role Deleted Successfully." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to delete role.");
  }
};
