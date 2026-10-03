import express from "express";
import transactionController from "../controllers/transaction.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createTransactionSchema } from "../validators/transaction.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

/**
 * - POST /api/transactions/create
 * - create a transaction
 * - protected route
 */
router.post(
  "/create",
  authMiddleware.verifyJWT,
  validate(createTransactionSchema),
  transactionController.createTransaction,
);

/**
 * - GET /api/transactions/
 * - get user's all transactions
 * - protected route
 */
router.get(
  "/",
  authMiddleware.verifyJWT,
  transactionController.getTransactions,
);

/**
 * - GET /api/transactions/:id
 * - get a transaction by id
 * - protected route
 */
router.get(
  "/:id",
  authMiddleware.verifyJWT,
  transactionController.getTransaction,
);

/**
 * - PATCH /api/transactions/update/:id
 * - update a transaction by id
 * - protected route
 */
router.patch(
  "/update/:id",
  authMiddleware.verifyJWT,
  transactionController.updateTransaction,
);

/**
 * - DELETE /api/transactions/delete/:id
 * - delete a transaction by id
 * - protected route
 */
router.delete(
  "/delete/:id",
  authMiddleware.verifyJWT,
  transactionController.deleteTransaction,
);

export default router;
