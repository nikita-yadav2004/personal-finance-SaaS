import api from "../api/axios.js";

export const createAccountAPI = async (data) => {
  const response = await api.post("/accounts/createaccount", data);
  return response.data;
};

export const getAccounts = async () => {
  const response = await api.get("/accounts/getaccounts");
  return response.data;
};

export const getAccount = async (id) => {
  const response = await api.get(`/accounts/getaccount/${id}`);
  return response.data;
};

export const updateAccount = async (id, data) => {
  const response = await api.patch(`/accounts/updateaccount/${id}`, data);
  return response.data;
};

export const deleteAccount = async (id) => {
  const response = await api.delete(`/accounts/deleteaccount/${id}`);
  return response.data;
};
