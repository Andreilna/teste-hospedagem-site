import Hortalica from "../models/Hortalica.js"

class hortalicaService {
    async getAll(){
        try{
            const hortalica = await Hortalica.find();
            return hortalica;
        } catch (error){
            console.log(`❌ Erro no hortalicaService`,error);
            throw error;
        }
    }

    //Listando um registro único
    async getOne(id) {
        try {
            const hortalica = await Hortalica.findOne({_id: id});
            console.log(`✅ Hortaliça com id ${id} encontrada`);
            return hortalica;
        } catch (error){
            console.log("❌ Registro único não encontrado no hortalicaService", error);
            throw error;
        }
    }

    //Deletando hortalicas
    async deleteHortalica(id) {
        try{
            await Hortalica.findByIdAndDelete(id);
            console.log(`✅ Hortaliça com a id ${id} foi deletada!`)
        } catch (error){
            console.log(`❌ Erro no id ${id} ao deletar no hortalicaService`, error)
            throw error; 
        }
    }

    //Alterando dados da hortaliça
    async updateHortalica(id, nome_hortalica, tipo_hortalica, tempo_estimado, tempo_real, fertilizantes, nivel_agua, nivel_fertilizante) {
        try{
            const updateData = {
                nome_hortalica,
                tipo_hortalica,
                tempo_estimado,
                tempo_real,
                fertilizantes
            };

            // Atualiza os níveis se fornecidos
            if (nivel_agua !== null && nivel_agua !== undefined || nivel_fertilizante !== null && nivel_fertilizante !== undefined) {
                updateData.nivel = {};
                if (nivel_agua !== null && nivel_agua !== undefined) {
                    updateData.nivel.nivel_agua = Number(nivel_agua);
                }
                if (nivel_fertilizante !== null && nivel_fertilizante !== undefined) {
                    updateData.nivel.nivel_fertilizante = Number(nivel_fertilizante);
                }
            }

            const updateHortalica = await Hortalica.findByIdAndUpdate(id, updateData, { new: true });
            console.log(`✅ Dados da hortaliça com id ${id} alterados com sucesso`)
            return updateHortalica;
        } catch (error){
            console.log(`❌ Erro no id ${id} ao alterar no hortalicaService`, error);
            throw error;
        }
    }

    //Cadastrando hortalicas
    async createHortalica(nome_hortalica, tipo_hortalica, user, tempo_estimado = null, tempo_real = null, fertilizantes = [], nivel_agua = null, nivel_fertilizante = null) {
        try {
            const newHortalica = new Hortalica({
                nome_hortalica,
                tipo_hortalica,
                user,
                tempo_estimado,
                tempo_real,
                fertilizantes,
                nivel: {
                    nivel_agua: nivel_agua === undefined ? null : nivel_agua,
                    nivel_fertilizante: nivel_fertilizante === undefined ? null : nivel_fertilizante
                },
            });
            
            await newHortalica.save();
            console.log(`✅ Hortaliça cadastrada com sucesso - ID: ${newHortalica._id}`)
            return newHortalica;
        } catch (error) {
            console.log("❌ Erro ao criar hortalica no hortalicaService:", error);
            throw error;
        }
    }
}

export default new hortalicaService();