import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../../services/account.service";

const AccountCard = ({ account }) => {
  const navigate = useNavigate();
  const [isdelete, setIsDelete] = useState(false);

  const deleteUserAccount = async () => {
    try {
      const id = account._id;
      const result = await deleteAccount(id);
      console.log(result);

      navigate(0);
    } catch (error) {
      console.log(error.response);
    } finally {
      setIsDelete(false);
    }
  };
  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg relative">
      {isdelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div
            className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-account-title-${account._id}`}
          >
            <p id={`delete-account-title-${account._id}`} className="text-base font-semibold text-red-800">
              Delete account?
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{account.name}</span>?
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Your historical transactions will remain available.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDelete(false)}
                type="button"
                className="mt-4 rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteUserAccount}
                type="button"
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {account.name}
          </h2>
          <h3 className="mt-1 text-sm font-medium text-slate-500">
            {account.name}
          </h3>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {account.type}
        </span>
      </div>

      <p className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
        {account.currency === "INR"
          ? "₹"
          : account.currency === "USD"
            ? "$"
            : "₹"}
        {account.balance}
      </p>
      <p className="mt-1 text-sm text-slate-500">Available balance</p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm font-medium text-slate-700">
            {account.institution}
          </p>
          <p className="mt-1 text-sm tracking-widest text-slate-500">
            {account.last4 ? `•••• ${account.last4}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              navigate(`/accounts/${account._id}/edit`);
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="button"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setIsDelete(true);
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
