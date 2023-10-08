import express from "express";
import {
  createUser,
  getUsersById,
  disableUser,
  userStats,
  deleteUser,
} from "../controllers/users";

const router = express.Router();

/**
 * @openapi
 * '/api/v1/users/add-user':
 *  post:
 *     tags:
 *     - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": true
 *             "message": "User created successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "message": "Fail to create user."
 *       422:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": false
 *             "message": "User already exits."
 */
router.post("/add-user", createUser);

/**
 * @openapi
 * /api/v1/users/{id}:
 *  get:
 *     tags:
 *     - Users
 *     description: Return users
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": true
 *             "data": []
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "message": "failed to load users."
 */
router.get("/users/:id", getUsersById);

/**
 * @openapi
 * /api/v1/users/disable-user/{id}/{status}:
 *  get:
 *     tags:
 *     - Users
 *     description: Active/De-active the user
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": true
 *             "message": 'User Status Changed.'
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "message": "failed to update user status."
 *       422:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": false
 *             "message": "Something went wrong, try again."
 */
router.get("/disable-user/:id/:status", disableUser);

router.get("/user-status/:stat", userStats);

/**
 * @openapi
 * /api/v1/users/user/{id}:
 *  delete:
 *     tags:
 *     - Users
 *     description: Delete a user by id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/User'
 *           example:
 *             "ok": true
 *             "message": "User Deleted."
 *       404:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": false
 *             "message": "User not found."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": false
 *             "message": "Fail to delete user."
 */
router.delete("/user/:id", deleteUser);

export default router;
