import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import { authDataContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShown, setIsShown] = useState(false);

  const { userData, setUserData } = useContext(authDataContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      userName,
      email,
      password,
    };

    try {
      let result = await registerUser(data);

      setLoading(false);
      navigate("/dashboard");

      setUserData(result);
      setUserName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        console.error(
          "Connection failed. Check your internet or CORS settings.",
        );
      } else {
        console.error("Login failed:", err.response?.data || err.message);
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
            handleSignup(e);
          }}
          className="flex flex-col gap-3 w-[90%] md:w-[50%] lg:w-[30%]"
        >
          <h2 className="text-2xl font-medium">Sign Up</h2>
          <input
            required
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            className="rounded outline-none px-2 py-1 w-full border border-gray-600"
            type="text"
            placeholder="Name"
          />
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
          </div>
          <button className="cursor-pointer rounded outline-nonr px-5 py-1 bg-blue-400 text-white">
            {loading ? "loading..." : "Sign up"}
          </button>
          <p
            onClick={() => {
              navigate("/login");
            }}
            className="text-center cursor-pointer"
          >
            Don't have an account? <span className="text-blue-400">Log in</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
