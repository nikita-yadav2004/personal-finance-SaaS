import React, { useState } from "react";
import { resetPassword } from "../services/auth.service";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [isShown, setIsShown] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const HandleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const result = await resetPassword(token, { password });
      console.log(result);
      setPassword("");
      navigate("/login")
    } catch (error) {
      console.log(error);
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
            HandleResetPassword(e);
          }}
          className="flex flex-col gap-3 w-[90%] md:w-[50%] lg:w-[30%]"
        >
          <h2 className="text-2xl font-medium">Reset Password</h2>
          <div className="relative">
            <input
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="rounded outline-none px-2 py-1 w-full border border-gray-600"
              type={isShown ? "text" : "password"}
              placeholder="Password"
            />
            <p
              onClick={() => {
                setIsShown((prev) => !prev);
              }}
              className="absolute top-1 right-2 text-blue-400 text-[14px] cursor-pointer"
            >
              {isShown ? "hide" : "show"}
            </p>
          </div>
          <button className="cursor-pointer rounded outline-nonr px-5 py-1 bg-blue-400 text-white">
            Set New Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
