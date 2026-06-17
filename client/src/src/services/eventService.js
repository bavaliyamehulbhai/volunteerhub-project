import api from "./api";

export const createEvent = async (
  eventData
) => {
  const response =
    await api.post(
      "/events",
      eventData
    );

  return response.data;
};

export const getEvents = async (params = {}) => {
  const response = await api.get("/events", { params });
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const getRecommendedEvents = async () => {
  const response = await api.get("/events/recommended");
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};