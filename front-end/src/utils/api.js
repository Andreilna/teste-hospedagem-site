import axios from "axios";

// Define a URL base da API dinamicamente.
// Se houver variável NEXT_PUBLIC_API_BASE_URL, usa ela.
// Caso contrário, usa a URL do Render.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://greenrise-by-ceres.onrender.com",
});

// Interceptador para incluir o token automaticamente
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;