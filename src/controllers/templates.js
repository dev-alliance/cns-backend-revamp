const {Templates} = require("../Schema/TemplateSchema")
const createTemplate = async (req, res) => {
  console.log(req.body)
    try {
      const r = new Templates(req.body);
      await r.save();
      return res.json({ ok: true, message: "Template upload successfully." });
    } catch (err) {
      console.log(err)
      return res.status(400).json({ ok: false, message: "Failed to upload template" });
    }
  }

  const getTemplateById =  async (req, res) => {
    console.log(req.body);
    try {
      const r = await Templates.find({ id: req.params.id });
      return res.json({ ok: true, data: r });
    } catch (err) {
      return res.json({ ok: false, message: "Failed to load template." });
    }
  }

  const deleteTemplate =  async (req, res) => {
    console.log(req.body);
    try {
      const r = await Templates.deleteOne({ _id: req.params.id });
      if (r.deletedCount > 0) {
        return res.json({ ok: true, data: r, message: "Template deleted." });
      } else {
        return res.status(400).json({ ok: false, data: r, message: "Failed to delete template." });
      }
    } catch (err) {
      return res.status(400).json({ ok: false, message: "Failed to delete template." });
    }
  }


  module.exports = {
    createTemplate,
    getTemplateById,
    deleteTemplate
  }