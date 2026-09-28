import React, { useState } from "react";
import { forgotPassword } from "../services/auth.service";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resend, setResend] = useState(false);

  const [email, setEmail] = useState("");

  const HandleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const result = await forgotPassword({ email });
      console.log(result);
      setEmail("");
    } catch (error) {
      console.log("forgot password error", error);
    }
  };

  return (
    <div className="w-full h-screen p-5">
      <div className="w-full h-[10%]">
        <h1 className="text-xl font-medium">Finance</h1>
      </div>
      <div className="w-full h-[90%] flex justify-center mt-20">
        <form
          onSubmit={(e) => {
            HandleForgotPassword(e);
          }}
          className="flex flex-col gap-3 w-[90%] md:w-[50%] lg:w-[30%]"
        >
          <h2 className="text-2xl font-medium">Forgot Password</h2>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="rounded outline-none px-2 py-1 w-full border border-gray-600"
            type="email"
            placeholder="Email"
          />
          <button className="cursor-pointer rounded outline-nonr px-5 py-1 bg-blue-400 text-white">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
