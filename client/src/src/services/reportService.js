import api from "./api";

export const getSummaryReport = async () => {
  const response = await api.get("/reports/summary");
  return response.data;
};

export const exportCSV = async (params) => {
  const response = await api.get("/reports/export-csv", {
    params,
    responseType: "blob",
  });
  return response.data;
};

export const exportPDF = async () => {
  const response = await api.get("/reports/export-pdf", {
    responseType: "blob",
  });
  return response.data;
};
