import axios from "axios";
import Cookies from "js-cookie";

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

// Interceptor de resposta para tratar erros 401 (token inválido/expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber erro 401, token inválido ou expirado
    if (error.response?.status === 401) {
      // Limpa token do localStorage e cookie
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        Cookies.remove("token");
        document.cookie = "token=; max-age=0; path=/; HttpOnly";
        
        // Redireciona para a página de login
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
