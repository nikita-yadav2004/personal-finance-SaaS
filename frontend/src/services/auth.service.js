import api from "../api/axios.js";

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/user");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (data) => {
  const response = await api.post("/auth/forgotpassword", data);
  return response.data;
};

export const resetPassword = async (token, data) => {
  const response = await api.post(`/auth/resetpassword/${token}`, data);
  return response.data;
};
