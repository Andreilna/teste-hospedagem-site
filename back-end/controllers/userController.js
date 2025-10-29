import userService from "../services/userService.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // ✅ Import bcrypt
import 'dotenv/config'; // ✅ Também no controller

// ✅ Usar variável de ambiente (.env)
const JWTSecret = process.env.JWT_SECRET;

// ✅ Verificar se existe
if (!JWTSecret) {
    console.error("❌ JWT_SECRET não definido nas variáveis de ambiente!");
    process.exit(1);
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.status(200).json({ users: users });
    } catch(error) {
        console.log("❌ Erro em controller>userController>getAllUsers", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Função para login de usuario - CORRIGIDA
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email) return res.status(400).json({ error: "❌ Email é obrigatório" });

        const user = await userService.getOneByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "❌ O email enviado não foi encontrado" });
        }

        // ✅ Compara a senha enviada com a hash do banco
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "❌ Credenciais inválidas" });
        }

        // ✅ Gera token JWT
        jwt.sign(
            { id: user._id, email: user.email },
            JWTSecret,
            { expiresIn: "48h" },
            (err, token) => {
                if (err) {
                    res.status(400).json({ error: "❌ Erro ao gerar token" });
                } else {
                    res.status(200).json({ 
                        message: "✅ Login realizado com sucesso!",
                        token: token,
                        user: {
                            id: user._id,
                            firstname: user.firstname,
                            email: user.email
                        }
                    });
                }
            }
        );

    } catch (error) {
        console.log("❌ Erro interno ao efetuar login", error);
        res.status(500).json({ error: "❌ Erro interno do servidor" });
    }
};

const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, phoneNumber, password, gender } = req.body;

        // ✅ Hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 12);

        const userData = {
            firstname,
            lastname,
            email,
            phoneNumber,
            password: hashedPassword,
            gender
        };

        const newUser = await userService.createUser(userData);
        
        res.status(201).json({
            message: "✅ Usuário criado com sucesso!",
            user: newUser
        });
    } catch (error) {
        console.log("❌ Erro ao criar usuário:", error);
        res.status(500).json({ error: "❌ Erro interno do servidor" });
    }
};

// Resto do controller permanece igual...
const deleteUser = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            await userService.deleteUser(id);
            res.sendStatus(204);
        } else {
            console.log("❌ ID inválido para deletar usuário:", req.params.id);
            res.status(400).json({ error: "❌ ID inválido" });
        }
    } catch (error) {
        console.log("❌ Erro interno ao deletar usuário:", error);
        res.status(500).json({ error: "❌ Erro interno do servidor" });
    }
};

const updateUser = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const { firstname, lastname, email, phoneNumber, password, gender, profileImage } = req.body;

            let hashedPassword = password;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 12);
            }

            const updatedUser = await userService.updateUser(
                id, firstname, lastname, email, phoneNumber, hashedPassword, gender, profileImage
            );
            
            res.status(200).json({
                message: "✅ Usuário atualizado com sucesso!",
                user: updatedUser
            });
        } else {
            console.log("❌ ID inválido para atualizar usuário:", req.params.id);
            res.status(400).json({ error: "❌ ID inválido" });
        }
    } catch (error) {
        console.log("❌ Erro ao atualizar usuário:", error);
        res.status(500).json({ error: "❌ Erro interno do servidor" });
    }
};

const getUserById = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const user = await userService.getOneById(id);
            
            if (!user) return res.status(404).json({ error: "❌ Usuário não encontrado" });
            
            res.status(200).json({ user });
        } else {
            res.status(400).json({ error: "❌ ID inválido" });
        }
    } catch (error) {
        console.log("❌ Erro ao buscar usuário por ID:", error);
        res.status(500).json({ error: "❌ Erro interno do servidor" });
    }
};

export default { 
    getAllUsers, 
    createUser, 
    deleteUser,
    updateUser,
    getUserById,
    loginUser,
    JWTSecret 
};
