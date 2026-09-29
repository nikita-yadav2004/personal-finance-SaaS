import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import AccountList from "../../components/account/AccountList";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "../../services/account.service";

const Account = () => {
  const navigate = useNavigate();
  const [allAccounts, setAllAccounts] = useState(null);
  const [error, setError] = useState("");
  const [totalAccountBalance, setTotalAccountBalance] = useState(0);

  const getAllAccounts = async () => {
    try {
      const result = await getAccounts();
      setAllAccounts(result.accounts);
    } catch (error) {
      setError(error.response?.data?.message || "failed to get all accounts");
      console.log("failed to get all accounts");
    }
  };

  useEffect(() => {
    getAllAccounts();
  }, []);

  const getTotalBalance = () => {
    if (allAccounts) {
      const totalBalance = allAccounts.reduce(
        (total, account) => total + account.balance,
        0,
      );
      setTotalAccountBalance(totalBalance);
    }
  };
  useEffect(() => {
    getTotalBalance();
  }, [allAccounts]);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Accounts
        </h2>
        <button
          onClick={() => {
            navigate("/accounts/new");
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Add Account
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-100">
            Total Account Balance
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            ₹{totalAccountBalance}
          </p>
          <p className="mt-1 text-sm text-blue-100">
            Across all of your accounts
          </p>
        </div>
      </div>
      {(!allAccounts || error) && (
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600">
            +
          </div>
          <p className="text-xl font-semibold text-gray-900">
            You don't have any accounts yet.
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Add your bank account, cash wallet, credit card, or savings account
            to start tracking your finances.
          </p>
          <button
            onClick={() => navigate("/accounts/new")}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Add Account
          </button>
        </div>
      )}
      <AccountList allAccounts={allAccounts} />
    </div>
  );
};

export default Account;
