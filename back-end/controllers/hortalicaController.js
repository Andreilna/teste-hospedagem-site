import hortalicaService from "../services/hortalicaService.js";
import { ObjectId } from "mongodb";

const getAllHortalicas = async (req, res) => {
    try{
        const hortalicas = await hortalicaService.getAll();
        res.status(200).json({ hortalicas: hortalicas })
    }catch(error){
        console.log("❌ Erro na porta em controller>hortalicaController>getAllHortalicas", error);
        res.status(500).json({ error: "Erro interno do servidor"})
    }
};

const createHortalica = async (req, res) => {
    try {
        const { 
            nome_hortalica, 
            tipo_hortalica, 
            tempo_estimado, 
            tempo_real,
            fertilizantes, 
            nivel,
            user 
        } = req.body;
        
        const userId = req.user ? req.user.id : user;

        // Campos obrigatórios
        if (!nome_hortalica || !tipo_hortalica || !userId) {
            return res.status(400).json({ 
                error: "❌ Campos obrigatórios: nome_hortalica, tipo_hortalica e user" 
            });
        }

        console.log("📦 Dados recebidos:", {
            nome_hortalica,
            tipo_hortalica, 
            tempo_estimado,
            tempo_real,
            fertilizantes,
            nivel,
            user
        });

        await hortalicaService.createHortalica(
            nome_hortalica, 
            tipo_hortalica, 
            userId, 
            tempo_estimado, 
            tempo_real,
            fertilizantes || [], 
            nivel?.nivel_agua || null,
            nivel?.nivel_fertilizante || null
        );
        
        res.status(201).json({
            message: "✅ Hortaliça criada com sucesso!"
        });
    } catch (error) {
        console.log("❌ Erro na porta em controller>hortalicaController>createHortalica", error);
        res.status(500).json({ error: "❌ Erro interno do servidor" });
    }
}; 

const deleteHortalica = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            await hortalicaService.deleteHortalica(id);
            res.sendStatus(204);
        } else {
            console.log("❌ ID inválido para deletar hortaliça:", req.params.id);
            res.status(400).json({ 
                error: "❌ ID inválido" 
            });
        }
    } catch (error) {
        console.log("❌ Erro interno ao deletar hortaliça:", error);
        res.status(500).json({ 
            error: "❌ Erro interno do servidor" 
        });
    }
}; 

const updateHortalica = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const { 
                nome_hortalica, 
                tipo_hortalica, 
                tempo_estimado, 
                tempo_real, 
                fertilizantes, 
                nivel 
            } = req.body;

            // Extrair níveis do objeto nivel
            const nivel_agua = nivel?.nivel_agua;
            const nivel_fertilizante = nivel?.nivel_fertilizante;

            const updatedHortalica = await hortalicaService.updateHortalica(
                id, nome_hortalica, tipo_hortalica, tempo_estimado, tempo_real, fertilizantes, nivel_agua, nivel_fertilizante
            );
            
            res.status(200).json({
                message: "✅ Hortaliça atualizada com sucesso!",
                hortalica: updatedHortalica
            });
        } else {
            console.log("❌ ID inválido para atualizar hortaliça:", req.params.id);
            res.status(400).json({ error: "❌ ID inválido" });
        }
    } catch (error) {
        console.log("❌ Erro ao atualizar hortaliça:", error);
        res.status(500).json({ error: "❌ Erro interno do servidor" });
    }
};

const getHortalicaById = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const hortalica = await hortalicaService.getOne(id);
            
            if (!hortalica) {
                return res.status(404).json({ error: "❌ Hortaliça não encontrada" });
            }
            
            res.status(200).json({ hortalica });
        } else {
            res.status(400).json({ error: "❌ ID inválido" });
        }
    } catch (error) {
        console.log("❌ Erro ao buscar hortaliça por ID:", error);
        res.status(500).json({ error: "❌ Erro interno do servidor" });
    }
};

export default { 
    getAllHortalicas, 
    createHortalica, 
    deleteHortalica,
    updateHortalica,
    getHortalicaById 
};