import WaterLevel from '../models/WaterLevel.js';

class WaterLevelService {
  // Busca o nível atual da água para um usuário
  async getCurrentWaterLevel(userId) {
    try {
      const waterLevel = await WaterLevel.findOne({ user: userId })
        .sort({ createdAt: -1 }); // Pega o mais recente
      
      if (!waterLevel) {
        // Se não existe, cria um nível padrão
        const defaultLevel = new WaterLevel({
          nivel_agua: 75,
          user: userId
        });
        await defaultLevel.save();
        return defaultLevel;
      }
      
      return waterLevel;
    } catch (error) {
      console.log('❌ Erro ao buscar nível da água:', error);
      throw error;
    }
  }

  // Atualiza o nível da água
  async updateWaterLevel(userId, nivel_agua) {
    try {
      const waterLevel = new WaterLevel({
        nivel_agua,
        user: userId
      });
      
      await waterLevel.save();
      console.log(`✅ Nível da água atualizado: ${nivel_agua}L`);
      return waterLevel;
    } catch (error) {
      console.log('❌ Erro ao atualizar nível da água:', error);
      throw error;
    }
  }

  // Busca histórico de níveis da água
  async getWaterLevelHistory(userId, limit = 7) {
    try {
      const history = await WaterLevel.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return history.reverse(); // Ordem cronológica
    } catch (error) {
      console.log('❌ Erro ao buscar histórico da água:', error);
      throw error;
    }
  }
}

export default new WaterLevelService();
