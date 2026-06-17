import api from "./api";

export const applyEvent = async (eventId) => {
  const response = await api.post("/applications", { eventId });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications/my");
  return response.data;
};

export const getAllApplications = async () => {
  const response = await api.get("/applications");
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}`, { status });
  return response.data;
};

export const getApplicationStats = async () => {
  const response = await api.get("/applications/stats");
  return response.data;
};
