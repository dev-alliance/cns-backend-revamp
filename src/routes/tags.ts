import express from "express";
import { createTag, getTags } from "../controllers/tags"

const router = express.Router();

/**
 * @openapi
 * '/api/v1/tags/create-tag':
 *  post:
 *     tags:
 *     - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tags'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TagsResponse'
 *           example:
 *             "ok": true
 *             "message": "Tag Created Successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TagsResponse'
 *           example:
 *             "message": "Failed to create tag."
 */
router.post("/create-tag", createTag);

/**
 * @openapi
 * /api/v1/tags/tag/{id}:
 *  get:
 *     tags:
 *     - Tags
 *     description: Retruns tags associated with id
 *     responses:
 *       200:
 *         example:
 *            "ok": true
 *            "tags": []
 */
router.get("/tag/:id", getTags);

export default router;
