import api from "./api";

export const uploadImage = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress
  });

  return response.data;
};
