import accountModel from "../models/account.model.js";
import categoryModel from "../models/category.model.js";

export const validateNewTransaction = async (
  data,
  type,
  userId,
  session,
  oldTransaction,
  res,
) => {
  if (type === "income" || type === "expense") {
    const account = await accountModel
      .findOne({
        _id: data.account || oldTransaction.account,
        user: userId,
      })
      .session(session);

    if (!account) {
      return res.status(401).json({ message: "Account not found" });
    }

    const category = await categoryModel
      .findOne({
        _id: data.category || oldTransaction.category,
        $or: [{ user: userId }, { user: null, isDefault: true }],
      })
      .session(session);

    if (!category) {
      return res.status(401).json({
        message: "Category not found",
      });
    }
  }

  if (type === "transfer") {
    const accounts = await accountModel
      .find({
        _id: {
          $in: [
            data.fromAccountId || oldTransaction.fromAccountId,
            data.toAccountId || oldTransaction.toAccountId,
          ],
        },
        user: userId,
      })
      .session(session);

    if (accounts.length !== 2) {
      return res
        .status(401)
        .json({ message: "One or both accounts are invalid" });
    }

    if (
      (data.fromAccountId.toString() ||
        oldTransaction.fromAccountId.toString()) ===
      (data.toAccountId.toString() || oldTransaction.toAccountId.toString())
    ) {
      return res
        .status(401)
        .json({ message: "Source and destination accounts must be different" });
    }
  }
};
