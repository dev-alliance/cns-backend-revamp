const { Permissions } = require("../schema/Permissions");

const createPermission = async (req, res) => {
    try {
      const permissions = new Permissions(req.body);
      await permissions.save();
      return res.json({ ok: true, message: "Role created successfully." });
    } catch (err) {
      return res.json({ ok: false, message: "Failed to add roles & permission" });
    }
  }

  const getPermissions = async (req, res) => {
    console.log(req.params)
    try {
      const permissions = await Permissions.find({ id: req.params.id }).select(
        "-permissions"
      );
      return res.json({ ok: true, data: permissions });
    } catch (err) {
      return res.json({
        ok: false,
        message: "Failed to load add roles & permission",
      });
    }
  }


  const deletePermissions = async (req, res) => {
    try {
      const permissions = await Permissions.deleteOne({ _id: req.params.id });
      if (permissions.deletedCount > 0) {
        return res.json({ ok: true, message: "Role delete successfully." });
      }
    } catch (err) {
      return res.json({
        ok: false,
        message: "Failed to delete roles & permission",
      });
    }
  }

  module.exports = {
    createPermission,
    getPermissions,
    deletePermissions
  }