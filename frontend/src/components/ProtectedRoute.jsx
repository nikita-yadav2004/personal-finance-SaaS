import { useContext } from "react";
import { authDataContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { userData, loading } = useContext(authDataContext);
  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
