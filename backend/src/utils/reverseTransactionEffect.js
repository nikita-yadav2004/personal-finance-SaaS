import accountModel from "../models/account.model.js";

export const reverseTransactionEffect = async (transaction, session) => {
  if (transaction.type === "expense") {
    await accountModel.findByIdAndUpdate(
      {
        _id: transaction.account,
      },
      {
        $inc: {
          balance: transaction.amount,
        },
      },
      { session },
    );
  }

  if (transaction.type === "income") {
    await accountModel.findByIdAndUpdate(
      {
        _id: transaction.account,
      },
      {
        $inc: {
          balance: -transaction.amount,
        },
      },
      { session },
    );
  }

  if (transaction.type === "transfer") {
    await accountModel.findByIdAndUpdate(
      {
        _id: transaction.fromAccountId,
      },
      {
        $inc: {
          balance: transaction.amount,
        },
      },
      { session },
    );

    await accountModel.findByIdAndUpdate(
      {
        _id: transaction.toAccountId,
      },
      {
        $inc: {
          balance: -transaction.amount,
        },
      },
      { session },
    );
  }
};
