import userModel from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { generateHash, compareHash } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * - POST /api/auth/register
 * - Register User
 */
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const hashedPassword = await generateHash(password);

    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

    return res.status(201).json({
      message: "User successfully created.",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "register user error", error });
  }
};

/**
 * - POST /api/auth/login
 * - log in User
 */
const loginUser = async (req, res) => {
  console.log("first")
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "User does't exists",
      });
    }

    const isPasswordCorrect = await compareHash(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

    return res.status(200).json({
      message: "User logged In",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "login user error", error });
  }
};

/**
 * - POST /api/auth/logout
 * - log out User
 */
const logoutUser = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken || !refreshToken) {
      return res.status(401).json({
        message: "User is not logged in.",
      });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(201).json({
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "logout user error", error });
  }
};

/**
 * - POST /api/auth/refresh
 * - generate access token
 * - refresh token endpoint
 */
const refreshAccessToken = async (req, res) => {

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "refresh token not found",
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const accessToken = generateAccessToken(decoded.userId);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Access token refreshed",
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Invalid JWT refresh token" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Refresh access token error", error });
  }
};

/**
 * - GET /api/auth/user
 * - get current user
 */
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Get current user successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Get current user error",
      error,
    });
  }
};

/**
 * - POST /api/auth/forgotpassword
 * - forgot password route
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`;

    console.log("Password reset URL:", resetUrl);

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Forgot password error",
      error,
    });
  }
};

/**
 * - POST /api/auth/resetpassword/:token
 * - reset password route
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log(password , token)

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await generateHash(password);

    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
    
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "reset password error",
      error,
    });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
