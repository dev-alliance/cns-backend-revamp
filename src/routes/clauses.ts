import express from "express";
import {
  createClauses,
  getClausesById,
  deleteClauses,
} from "../controllers/clauses";

const router = express.Router();
/**
 * @openapi
 * '/api/v1/clauses/create-clauses':
 *  post:
 *     tags:
 *     - Clauses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clauses'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/ClausesResponse'
 *           example:
 *             "ok": true
 *             "message": "Clauses created successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "message": "Failed to create clauses."
 */
router.post("/create-clauses", createClauses);
/**
 * @openapi
 * /api/v1/clauses/{id}:
 *  get:
 *     tags:
 *     - Clauses
 *     description: Returns an array of clauses associated with given Id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "clauses": []
 */
router.get("/:id", getClausesById);
/**
 * @openapi
 * /api/v1/clauses/{id}:
 *  delete:
 *     tags:
 *     - Clauses
 *     description: Delete a clauses by id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "message": "Clause Deleted Successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": false
 *             "message": "Failed to delete Clause."
 */
router.delete("/:id", deleteClauses);

export default router;
