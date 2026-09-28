import React from "react";
import { logoutUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const HandleLogout = async () => {
    try {
      const result = await logoutUser();
      console.log(result);
      navigate("/login");
    } catch (error) {
      console.log("Logout error", error);
    }
  };
  return (
    <div>
      
    </div>
  );
};

export default Dashboard;
