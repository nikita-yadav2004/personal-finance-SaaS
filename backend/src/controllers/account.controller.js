import accountModel from "../models/account.model.js";
import userModel from "../models/user.model.js";

/**
 * - POST /api/accounts/createaccount
 * - create account
 * - protected route
 */
const createAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, type, balance, currency, institution, last4, isActive } =
      req.body;

    console.log(name, type, isActive);
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({
        message: "User does't exists",
      });
    }

    const account = await accountModel.create({
      user: userId,
      name,
      type,
      balance,
      currency,
      institution,
      last4,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Account Created",
      account,
    });
  } catch (error) {
    console.log("create Account Error", error);
    return res.status(401).json({
      success: false,
      message: "Failed to create account",
      error: error.message,
    });
  }
};

/**
 * - GET /api/accounts/getaccounts
 * - get user's all accounts
 * - protected route
 */
const getAccounts = async (req, res) => {
  try {
    const userId = req.userId;

    const accounts = await accountModel
      .find({
        user: userId,
        isActive: true,
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User's all accounts fetched",
      accounts,
    });
  } catch (error) {
    console.log("Get  Accounts Error", error);
    return res.status(401).json({
      success: false,
      message: "Failed to get user's accounts",
      error,
    });
  }
};

/**
 * - GET /api/accounts/getaccount/:id
 * - get user account by id
 * - protected route
 */
const getAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;

    console.log(id)
    const account = await accountModel.findOne({
      user: userId,
      _id: id,
      isActive: true,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json({
      message: "account fetched successfully.",
      account,
    });
  } catch (error) {
    console.log("Get  Account Error", error);
    return res.status(401).json({
      success: false,
      message: "Failed to get user's account",
      error,
    });
  }
};

/**
 * - PATCH /api/accounts/updateaccount/:id
 * - update account by id
 * - protected route
 */
const updateAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;

    const account = await accountModel.findOneAndUpdate(
      {
        user: userId,
        _id: id,
      },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!account) {
      return res.status(401).json({ message: "Account don't exists" });
    }

    return res.status(201).json({
      message: "Account updated successfully",
      account,
    });
  } catch (error) {
    console.log("update  Account Error", error);
    return res.status(401).json({
      success: false,
      message: "Failed to update user's account",
      error,
    });
  }
};

/**
 * - DELETE /api/accounts/deleteaccount/:id
 * - update account by id
 * - protected route
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;

    const account = await accountModel.findOneAndUpdate(
      {
        user: userId,
        _id: id,
      },
      {
        isActive: false,
      },
      {
        returnDocument: "after",
      },
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("delete  Account Error", error);
    return res.status(401).json({
      success: false,
      message: "Failed to delete user's account",
      error,
    });
  }
};

export default {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
};
