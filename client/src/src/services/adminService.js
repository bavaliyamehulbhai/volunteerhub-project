import api from "./api";

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get("/admin/analytics");
  return response.data;
};

export const getVolunteers = async () => {
  const response = await api.get("/admin/volunteers");
  return response.data;
};


