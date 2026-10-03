import mongoose from "mongoose";
import transactionModel from "../models/transaction.model.js";
import accountModel from "../models/account.model.js";
import categoryModel from "../models/category.model.js";
import { reverseTransactionEffect } from "../utils/reverseTransactionEffect.js";
import { applyTransactionEffect } from "../utils/applyTransactionEffect.js";
import { validateNewTransaction } from "../utils/validateNewTransaction .js";

/**
 * - POST /api/transactions/create
 * - create a transaction
 */
const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userId = req.userId;

    const {
      name,
      accountId,
      categoryId,
      type,
      amount,
      description,
      date,
      notes,
      fromAccountId,
      toAccountId,
    } = req.body;

    console.log(req.body);
    if (type === "income" || type === "expense") {
      const account = await accountModel
        .findOne({
          _id: accountId,
          user: userId,
          isActive: true,
        })
        .session(session);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const category = await categoryModel
        .findOne({
          _id: categoryId,
          $or: [{ userId }, { user: null, isDefault: true }],
        })
        .session(session);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (category.type !== type) {
        return res
          .status(404)
          .json({ message: `Category must be an ${type} category` });
      }

      if (type === "income") {
        account.balance += amount;
      } else {
        account.balance -= amount;
      }

      await account.save({ session });

      const transaction = await transactionModel.create(
        [
          {
            user: userId,
            account: accountId,
            category: categoryId,
            name,
            type,
            amount,
            description,
            date,
            notes,
          },
        ],
        { session },
      );

      await session.commitTransaction();

      return res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: transaction,
      });
    }

    if (type === "transfer") {
      if (fromAccountId === toAccountId) {
        throw new Error("Source and destination accounts must be different");
      }

      const fromAccount = await accountModel
        .findOne({
          _id: fromAccountId,
          user: userId,
          isActive: true,
        })
        .session(session);

      const toAccount = await accountModel
        .findOne({
          _id: toAccountId,
          user: userId,
          isActive: true,
        })
        .session(session);

      if (!fromAccount || !toAccount) {
        throw new Error("Account not found");
      }

      if (fromAccount.balance < amount) {
        throw new Error("Insufficient account balance");
      }

      fromAccount.balance -= amount;
      toAccount.balance += amount;

      await fromAccount.save({ session });
      await toAccount.save({ session });

      const transaction = await transactionModel.create(
        [
          {
            user: userId,
            amount,
            name,
            type,
            description,
            date,
            notes,
            fromAccountId,
            toAccountId,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: transaction,
      });
    }
  } catch (error) {
    await session.abortTransaction();
    console.log("create transaction error", error);
    return res.status(401).json({ message: "create transaction error", error });
  } finally {
    session.endSession();
  }
};

/**
 * - GET /api/transactions/
 * - get user's all transactions
 * - protected route
 */
const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;

    const transactions = await transactionModel.find({
      user: userId,
    });

    return res
      .status(200)
      .json({ message: "Transactions fetched", transactions });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error });
  }
};

/**
 * - GET /api/transactions/:id
 * - get a transaction by id
 * - protected route
 */
const getTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;

    const transaction = await transactionModel.findOne({
      user: userId,
      _id: id,
    });

    return res.status(200).json({
      message: "Transaction fetched.",
      transaction,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error });
  }
};

/**
 * - PATCH /api/transactions/update/:id
 * - update a transaction by id
 * - protected route
 */
const updateTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userId = req.userId;
    const { id } = req.params;
    const {
      category,
      name,
      type,
      amount,
      description,
      date,
      notes,
      fromAccountId,
      toAccountId,
    } = req.body;

    const oldTransaction = await transactionModel.findOne({
      _id: id,
      user: userId,
    });

    if (!oldTransaction) {
      return res.status(401).json({ message: "Transaction not found" });
    }

    const newType = type ?? oldTransaction.type;
    const newAmount = amount ?? oldTransaction.amount;

    if (newAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    await reverseTransactionEffect(oldTransaction, session);

    await validateNewTransaction(
      req.body,
      newType,
      userId,
      session,
      oldTransaction,
      res,
    );

    Object.assign(oldTransaction, {
      ...req.body,
      type: newType,
      amount: newAmount,
    });

    await oldTransaction.save({ session });

    await applyTransactionEffect(oldTransaction, session);

    await session.commitTransaction();

    return res.status(200).json({
      message: "update transaction successful",
      oldTransaction,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error });
  } finally {
    session.endSession();
  }
};

/**
 * - DELETE /api/transactions/delete/:id
 * - delete a transaction by id
 * - protected route
 */
const deleteTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await transactionModel
      .findOne({
        _id: id,
        user: userId,
      })
      .session(session);

    const account = await accountModel
      .findOne({
        _id: transaction.account || transaction.fromAccountId,
        user: userId,
      })
      .session(session);

    if (!account) {
      return res.status(401).json({ message: "Account not found" });
    }

    reverseTransactionEffect(transaction, session);

    await transactionModel
      .deleteOne({
        _id: transaction._id,
      })
      .session(session);

    session.commitTransaction();

    return res.status(200).json({ message: "Delete transaction successful" });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error });
  } finally {
    session.endSession();
  }
};

export default {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
