// src/services/api.js
export async function apiFetch(path, options = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"; // ex.: http://localhost:4000
  // pegue o token do localStorage (ou use um token fixo em env pública se quiser)
  const lsToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const envToken = process.env.NEXT_PUBLIC_STATIC_TOKEN; // opcional
  const token = lsToken || envToken;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const resp = await fetch(`${base}${path}`, { ...options, headers });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data?.error || `Erro ${resp.status}`);
  return data;
}

// Função específica para buscar dados de uma hortaliça
export async function getVegetableData(vegetableId) {
  try {
    const response = await apiFetch(`/hortalicas/${vegetableId}`);
    return response.hortalica;
  } catch (error) {
    console.error('Erro ao buscar dados da hortaliça:', error);
    throw error;
  }
}

// Função para buscar dados de sensores específicos de uma hortaliça
export async function getVegetableSensorData(vegetableId) {
  try {
    // Simulando dados de sensores baseados na hortaliça
    const vegetable = await getVegetableData(vegetableId);
    
    // Dados simulados baseados na hortaliça selecionada
    const sensorData = {
      temperatura: 22 + Math.random() * 6, // 22-28°C
      umidade: 60 + Math.random() * 20, // 60-80%
      luminosidade: 500 + Math.random() * 500, // 500-1000 lux
      nivel_agua: vegetable?.nivel?.nivel_agua || 70,
      ph_solo: 6.0 + Math.random() * 1.5, // 6.0-7.5
      condutividade: 1.2 + Math.random() * 0.8 // 1.2-2.0 mS/cm
    };
    
    return sensorData;
  } catch (error) {
    console.error('Erro ao buscar dados dos sensores:', error);
    throw error;
  }
}

// Função para buscar histórico de crescimento de uma hortaliça
export async function getVegetableGrowthHistory(vegetableId) {
  try {
    const vegetable = await getVegetableData(vegetableId);
    
    // Simulando histórico de crescimento baseado no tempo estimado
    const days = vegetable?.tempo_estimado || 30;
    const history = [];
    
    for (let i = 0; i < Math.min(days, 30); i++) {
      const progress = (i / days) * 100;
      history.push({
        dia: i + 1,
        crescimento: Math.min(progress + (Math.random() - 0.5) * 10, 100),
        altura: (progress / 100) * (vegetable?.tipo_hortalica === 'Folhosa' ? 30 : 50) + Math.random() * 5,
        folhas: vegetable?.tipo_hortalica === 'Folhosa' ? Math.floor(progress / 10) + Math.floor(Math.random() * 3) : 0
      });
    }
    
    return history;
  } catch (error) {
    console.error('Erro ao buscar histórico de crescimento:', error);
    throw error;
  }
}