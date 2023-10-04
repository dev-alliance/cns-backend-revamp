const express = require("express");
const router = express.Router();
const { createTemplate, getTemplateById, deleteTemplate } = require("../controllers/templates");


/**
 * @openapi
 * '/api/v1/templates/create-template':
 *  post:
 *     tags:
 *     - Templates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Templates'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TemplatesResponse'
 *           example:
 *             "ok": true
 *             "message": "Template upload successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TemplatesResponse'
 *           example:
 *             "message": "Failed to upload template."
 */
router.post("/create-template", createTemplate);

/**
 * @openapi
 * /api/v1/templates/{id}:
 *  get:
 *     tags:
 *     - Templates
 *     description: Returns an array of templates associated with given Id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TemplatesResponse'
 *           example:
 *             "ok": true
 *             "templates": []
 */
router.get("/:id", getTemplateById);

/**
 * @openapi
 * /api/v1/templates/delete-template/{id}:
 *  delete:
 *     tags:
 *     - Templates
 *     description: Delete a template by id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Templates'
 *           example:
 *             "ok": true
 *             "message": "Template deleted."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TemplatesResponse'
 *           example:
 *             "ok": false
 *             "message": "Failed to delete template."
 */
router.delete("/delete-template/:id",deleteTemplate);

module.exports = router