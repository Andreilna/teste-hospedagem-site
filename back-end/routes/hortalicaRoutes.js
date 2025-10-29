import express from "express";
const hortalicaRoutes = express.Router();
import hortalicaController from "../controllers/hortalicaController.js";
import Authorization from "../middleware/Auth.js" 

// Endpoint para criar hortaliça
hortalicaRoutes.post("/hortalicas", Authorization, hortalicaController.createHortalica);

// Endpoint para listar todas as hortaliças
hortalicaRoutes.get("/hortalicas", Authorization, hortalicaController.getAllHortalicas);

// Endpoint para deletar hortaliça
hortalicaRoutes.delete("/hortalicas/:id", Authorization, hortalicaController.deleteHortalica);

//Endpoint para atualizar hortalica
hortalicaRoutes.put("/hortalicas/:id", Authorization, hortalicaController.updateHortalica);

//Endpoint para listar uma hortalica
hortalicaRoutes.get("/hortalicas/:id", Authorization, hortalicaController.getHortalicaById);

export default hortalicaRoutes;