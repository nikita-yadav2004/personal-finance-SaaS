import { useContext } from "react";
import { authDataContext } from "./context/AuthContext";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

const App = () => {
  const { userData, setUserData } = useContext(authDataContext);

  if (userData === null) return null;

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={userData ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={userData ? <Navigate to="/dashboard" /> : <Signup />}
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
