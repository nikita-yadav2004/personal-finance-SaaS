import React, { useEffect, useState } from "react";
import AccountForm from "../../components/account/AccountForm";
import { useNavigate, useParams } from "react-router-dom";
import { getAccount, updateAccount } from "../../services/account.service";
import Navbar from "../../components/Navbar";

const EditAccount = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      try {
        const result = await getAccount(id);
        setAccount(result.account);
      } catch (error) {
        console.log("Failed to fetch account details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      setSaving(true);
      setError("");
      await updateAccount(id, data);
      navigate("/accounts");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update Account");
      console.log("update account error", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading account...</div>;
  }

  if (!account) {
    return <div className="p-6">Account not found.</div>;
  }
  return (
    <div className="flex h-screen flex-col p-5">
      <Navbar />
      <div className="w-full h-[90%] flex flex-col justify-center items-center">
        <h1 className="mb-6 text-2xl font-bold">Update Account</h1>
        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-600">{error}</p>
        )}
        <AccountForm
          mode="edit"
          initialData={account}
          onSubmit={handleUpdate}
          onCancel={() => navigate("/accounts")}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default EditAccount;
