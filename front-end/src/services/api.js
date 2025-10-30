// src/services/api.js

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NEXT_PUBLIC_API_BASE_URL !== ""
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "https://greenrise-by-ceres.onrender.com";

// Pega token do localStorage ou variável de ambiente
function getToken() {
  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem("token");
    if (localToken) return localToken;
  }
  return process.env.NEXT_PUBLIC_STATIC_TOKEN || null;
}

// Função base de fetch
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) throw new Error(data?.error || `Erro ${response.status}`);
  return data;
}

// Cria métodos HTTP fáceis de usar
export const api = {
  get: (path, options) => apiFetch(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    apiFetch(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (path, body, options) =>
    apiFetch(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (path, options) => apiFetch(path, { ...options, method: "DELETE" }),
};

export default api;

// ------------------------
// Funções específicas para hortaliças
// ------------------------

export async function getVegetableData(vegetableId) {
  try {
    const response = await apiFetch(`/hortalicas/${vegetableId}`);
    return response.hortalica;
  } catch (error) {
    console.error("Erro ao buscar dados da hortaliça:", error);
    throw error;
  }
}

export async function getVegetableSensorData(vegetableId) {
  try {
    const vegetable = await getVegetableData(vegetableId);

    const sensorData = {
      temperatura: 22 + Math.random() * 6,
      umidade: 60 + Math.random() * 20,
      luminosidade: 500 + Math.random() * 500,
      nivel_agua: vegetable?.nivel?.nivel_agua || 70,
      ph_solo: 6.0 + Math.random() * 1.5,
      condutividade: 1.2 + Math.random() * 0.8,
    };

    return sensorData;
  } catch (error) {
    console.error("Erro ao buscar dados dos sensores:", error);
    throw error;
  }
}

export async function getVegetableGrowthHistory(vegetableId) {
  try {
    const vegetable = await getVegetableData(vegetableId);
    const days = vegetable?.tempo_estimado || 30;
    const history = [];

    for (let i = 0; i < Math.min(days, 30); i++) {
      const progress = (i / days) * 100;
      history.push({
        dia: i + 1,
        crescimento: Math.min(progress + (Math.random() - 0.5) * 10, 100),
        altura:
          (progress / 100) * (vegetable?.tipo_hortalica === "Folhosa" ? 30 : 50) +
          Math.random() * 5,
        folhas:
          vegetable?.tipo_hortalica === "Folhosa"
            ? Math.floor(progress / 10) + Math.floor(Math.random() * 3)
            : 0,
      });
    }

    return history;
  } catch (error) {
    console.error("Erro ao buscar histórico de crescimento:", error);
    throw error;
  }
}
