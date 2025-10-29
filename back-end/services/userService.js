import User from "../models/User.js"
import bcrypt from "bcryptjs"; // ✅ IMPORTAR BCRYPT

class userService {
    async getAll(){
        try{
            const users = await User.find();
            return users;
        } catch (error){
            console.log(`❌ Erro no userService`,error);
            throw error;
        }
    }

    // Cadastrando usuários
    async createUser(userData) {
        try {
            // ✅ GERAR HASH da senha
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            const newUser = new User({
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                password: userData.password, // já vem hash do controller
                gender: userData.gender,
                profileImage: userData.profileImage || "front-end/uploads/profile/arquivo.png"
            });
            
            await newUser.save();
            console.log(`✅ Usuário cadastrado com senha criptografada - ID: ${newUser._id}`)
            return newUser;
        } catch (error) {
            console.log("❌ Erro ao criar usuário no userService:", error);
            throw error;
        }
    }

    // Alterando dados do usuário
    async updateUser(id, firstname, lastname, email, phoneNumber, password, gender, profileImage) {
        try{
            
            let updateData = {
                firstname,
                lastname,
                email,
                phoneNumber,
                gender,
                profileImage
            };

            if (password) {
                const saltRounds = 12;
                updateData.password = await bcrypt.hash(password, saltRounds);
                console.log(`✅ Senha atualizada e criptografada para usuário ${id}`);
            }

            const updateUser = await User.findByIdAndUpdate(id, updateData, { new: true });
            console.log(`✅ Dados do usuário com id ${id} alterados com sucesso`)
            return updateUser;
        } catch (error){
            console.log(`❌ Erro no id ${id} ao alterar no userService`, error);
            throw error;
        }
    }

    // Listando um registro único por id
    async getOneById(id) {
        try {
            const user = await User.findOne({_id: id});
            console.log(`✅ Usuário com id ${id} encontrado`);
            return user;
        } catch (error){
            console.log("❌ Registro único não encontrado no userService", error);
            throw error;
        }
    }

    // Listando um registro único por email
    async getOneByEmail(email) {
        try {
            const user = await User.findOne({ email: email});
            console.log(`✅ Usuário com email ${email} encontrado`);
            return user;
        } catch (error){
            console.log("❌ Email não encontrado no userService", error);
            throw error;
        }
    }

    // Função para login de usuario
    async loginUser(email, password) {
        try {
            // Busca usuário por email
            const user = await this.getOneByEmail(email);
            
            if (!user) {
                throw new Error("Email não encontrado");
            }

            // ✅ VERIFICAR SENHA COM BCRYPT
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                throw new Error("Senha incorreta");
            }

            console.log(`✅ Login realizado com sucesso para: ${email}`);
            return user;
            
        } catch (error) {
            console.log("❌ Erro ao efetuar login no service:", error.message);
            throw error;
        }
    }

    // Deletando usuário 
    async deleteUser(id) {
        try{
            await User.findByIdAndDelete(id);
            console.log(`✅ Usuário com o id ${id} foi deletado`);
        } catch (error){
            console.log(`❌ Erro ao deletar no userService`, error);
            throw error;
        }
    }
}

export default new userService();