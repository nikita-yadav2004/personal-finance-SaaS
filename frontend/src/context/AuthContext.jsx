import axios from "axios";
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getCurrentUser } from "../services/auth.service";

export const authDataContext = createContext();
const AuthContext = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    setLoading(true);
    try {
      let result = await getCurrentUser();
      setUserData(result);

      setLoading(false);
    } catch (error) {
      console.log(error);
      
      setUserData(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const value = { userData, setUserData, loading, setLoading };
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  );
};

export default AuthContext;
