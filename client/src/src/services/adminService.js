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

export const getAdminRequests = async () => {
  const response = await api.get("/admin/requests");
  return response.data;
};

export const approveAdminRequest = async (id) => {
  const response = await api.post(`/admin/requests/${id}/approve`);
  return response.data;
};

export const rejectAdminRequest = async (id) => {
  const response = await api.post(`/admin/requests/${id}/reject`);
  return response.data;
};


