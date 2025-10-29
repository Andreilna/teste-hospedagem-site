import express from "express";
const waterLevelRoutes = express.Router();
import waterLevelController from "../controllers/waterLevelController.js";
import Authorization from "../middleware/Auth.js";

// Endpoint para buscar o nível atual da água
waterLevelRoutes.get("/water-level", Authorization, waterLevelController.getCurrentWaterLevel);

// Endpoint para atualizar o nível da água
waterLevelRoutes.put("/water-level", Authorization, waterLevelController.updateWaterLevel);

// Endpoint para buscar histórico de níveis da água
waterLevelRoutes.get("/water-level/history", Authorization, waterLevelController.getWaterLevelHistory);

export default waterLevelRoutes;
