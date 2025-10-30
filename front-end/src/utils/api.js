import axios from "axios";

const api = axios.create({
  baseURL: "https://greenrise-by-ceres.onrender.com", // Backend hospedado
});

api.interceptors.request.use((config) => {
  // Pega o token do localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
