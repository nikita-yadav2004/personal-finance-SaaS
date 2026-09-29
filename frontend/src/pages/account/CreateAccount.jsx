import { useState } from "react";
import AccountForm from "../../components/account/AccountForm";
import Navbar from "../../components/Navbar";
import { createAccountAPI } from "../../services/account.service";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      const result = await createAccountAPI(data);
      console.log(result);
      navigate("/accounts");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create account");
      console.log("create account failed", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen flex-col p-5">
      <Navbar />
      <div className="w-full h-[90%] flex flex-col justify-center items-center">
        <h1 className="mb-6 text-2xl font-bold">Create Account</h1>
        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-600">{error}</p>
        )}
        <AccountForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => navigate("/accounts")}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreateAccount;
