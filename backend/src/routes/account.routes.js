import express from "express";
import accountController from "../controllers/account.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createAccountValidator,
  updateAccountValidator,
} from "../validators/account.validator.js";

const router = express.Router();

/**
 * - POST /api/accounts/createaccount
 * - create account
 * - protected route
 */
router.post(
  "/createaccount",
  authMiddleware.verifyJWT,
  validate(createAccountValidator),
  accountController.createAccount,
);

/**
 * - GET /api/accounts/getaccounts
 * - get user's all accounts
 * - protected route
 */
router.get(
  "/getaccounts",
  authMiddleware.verifyJWT,
  accountController.getAccounts,
);

/**
 * - GET /api/accounts/getaccount/:id
 * - get user account by id
 * - protected route
 */
router.get(
  "/getaccount/:id",
  authMiddleware.verifyJWT,
  accountController.getAccount,
);

/**
 * - PATCH /api/accounts/updateaccount/:id
 * - update account by id
 * - protected route
 */
router.patch(
  "/updateaccount/:id",
  authMiddleware.verifyJWT,
  validate(updateAccountValidator),
  accountController.updateAccount,
);

/**
 * - DELETE /api/accounts/deleteaccount/:id
 * - update account by id
 * - protected route
 */
router.delete(
  "/deleteaccount/:id",
  authMiddleware.verifyJWT,
  accountController.deleteAccount,
);

export default router;
