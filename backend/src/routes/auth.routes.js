import express from "express";
import authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * - POST /api/auth/register
 * - Register User
 */
router.post("/register", validate(registerSchema), authController.registerUser);

/**
 * - POST /api/auth/login
 * - log in User
 */
router.post("/login", validate(loginSchema), authController.loginUser);

/**
 * - POST /api/auth/logout
 * - log out User
 */
router.post("/logout", authController.logoutUser);

/**
 * - POST /api/auth/refresh
 * - generate access token
 * - refresh token endpoint
 */
router.post("/refresh", authController.refreshAccessToken);

/**
 * - GET /api/auth/user
 * - get current user
 */
router.get("/user", authMiddleware.verifyJWT, authController.getCurrentUser);

/**
 * - POST /api/auth/forgotpassword
 * - forgot password route
 */
router.post(
  "/forgotpassword",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

/**
 * - POST /api/auth/resetpassword/:token
 * - reset password route
 */
router.post(
  "/resetpassword/:token",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
