import waterLevelService from '../services/waterLevelService.js';

// Busca o nível atual da água
const getCurrentWaterLevel = async (req, res) => {
  try {
    const userId = req.user.id;
    const waterLevel = await waterLevelService.getCurrentWaterLevel(userId);
    
    res.status(200).json({
      nivel_agua: waterLevel.nivel_agua,
      updatedAt: waterLevel.updatedAt
    });
  } catch (error) {
    console.log('❌ Erro ao buscar nível da água:', error);
    res.status(500).json({ error: '❌ Erro interno do servidor' });
  }
};

// Atualiza o nível da água
const updateWaterLevel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nivel_agua } = req.body;

    if (nivel_agua === undefined || nivel_agua === null) {
      return res.status(400).json({ 
        error: '❌ Nível da água é obrigatório' 
      });
    }

    if (nivel_agua < 0 || nivel_agua > 200) {
      return res.status(400).json({ 
        error: '❌ Nível da água deve estar entre 0 e 200 litros' 
      });
    }

    const waterLevel = await waterLevelService.updateWaterLevel(userId, nivel_agua);
    
    res.status(200).json({
      message: '✅ Nível da água atualizado com sucesso!',
      nivel_agua: waterLevel.nivel_agua,
      updatedAt: waterLevel.updatedAt
    });
  } catch (error) {
    console.log('❌ Erro ao atualizar nível da água:', error);
    res.status(500).json({ error: '❌ Erro interno do servidor' });
  }
};

// Busca histórico de níveis da água
const getWaterLevelHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 7;
    
    const history = await waterLevelService.getWaterLevelHistory(userId, limit);
    
    const formattedHistory = history.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      level: item.nivel_agua
    }));
    
    res.status(200).json({
      history: formattedHistory
    });
  } catch (error) {
    console.log('❌ Erro ao buscar histórico da água:', error);
    res.status(500).json({ error: '❌ Erro interno do servidor' });
  }
};

export default {
  getCurrentWaterLevel,
  updateWaterLevel,
  getWaterLevelHistory
};
