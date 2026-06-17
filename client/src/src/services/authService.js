import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};

export const verifyMfa = async (mfaData) => {
  const response = await api.post("/auth/verify-mfa", mfaData);
  return response.data;
};

export const verifySecurityQuestion = async (questionData) => {
  const response = await api.post("/auth/verify-question", questionData);
  return response.data;
};

export const getSecurityLogs = async () => {
  const response = await api.get("/auth/security-logs");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};