import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { authDataContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [error, setError] = useState("");

  const { userData, setUserData } = useContext(authDataContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      email,
      password,
    };

    try {
      let result = await loginUser(data);
      setUserData(result);

      setLoading(false);
      navigate("/dashboard");

      setEmail("");
      setPassword("");
      setError("")
    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        console.error(
          "Connection failed. Check your internet or CORS settings.",
        );
      } else {
        console.log("Login failed:", err.response?.data?.message);
        setError(err.response?.data?.message);
        setLoading(false);
      }
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
            handleLogin(e);
          }}
          className="flex flex-col gap-3 w-[90%] md:w-[50%] lg:w-[30%]"
        >
          <h2 className="text-2xl font-medium">Log In</h2>
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
            <p
              onClick={() => {
                navigate("/forgotpassword");
              }}
              className="text-blue-400 text-[14px] text-end cursor-pointer"
            >
              forgot password?
            </p>
          </div>
          {error && (<p className="text-red-400 text-[14px]">*{error}</p>)}
          <button className="cursor-pointer rounded outline-nonr px-5 py-1 bg-blue-400 text-white">
            {loading ? "loading..." : "Log In"}
          </button>
          <p
            onClick={() => {
              navigate("/signup");
            }}
            className="text-center cursor-pointer"
          >
            Don't have an account?{" "}
            <span className="text-blue-400">Sign in</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
