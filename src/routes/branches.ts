import express from 'express'
import {
  createBranch,
  getBranchById,
  deleteBranchById,
} from "../controllers/branches"

const router = express.Router();
/**
 * @openapi
 * '/api/v1/branches/create-branch':
 *  post:
 *     tags:
 *     - Branch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "message": "Branch created successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "message": "Failed to create branch."
 */
router.post("/create-branch", createBranch);
/**
 * @openapi
 * /api/v1/branches/{id}:
 *  get:
 *     tags:
 *     - Branch
 *     description: Returns an array of branches associated with given Id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "branches": []
 */
router.get("/branch/:id", getBranchById);
/**
 * @openapi
 * '/api/v1/branches/archive/{branchId}':
 *  post:
 *     tags:
 *     - Branch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "message": "Branch archive successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "message": "Failed to archive branch."
 */
router.post("/archive/:id", deleteBranchById);

export default router;
