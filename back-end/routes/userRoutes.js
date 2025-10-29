import express from "express";
import userController from "../controllers/userController.js";
import upload from "../config/multerConfig.js";
import Authorization from "../middleware/Auth.js"; // middleware de autenticação

const userRoutes = express.Router();

// ────────────── USUÁRIO ────────────── //

// O problema 'argument handler must be a function' ocorre se Authorization.validateToken
// ou userController.getAllUsers não for uma função válida.
// 1. Listar todos os usuários → PROTEGIDO
userRoutes.get("/user", Authorization, userController.getAllUsers);

// 2. Listar um usuário pelo ID → PROTEGIDO
userRoutes.get("/user/:id", Authorization, userController.getUserById);

// 3. Criar usuário COM upload de profileImage → PODE SER ABERTO
userRoutes.post("/user", upload.single('profileImage'), userController.createUser);

// 4. Atualizar usuário pelo ID → PROTEGIDO
userRoutes.put("/user/:id", Authorization, userController.updateUser);

// 5. Deletar usuário pelo ID → PROTEGIDO
userRoutes.delete("/user/:id", Authorization, userController.deleteUser);

// 6. Login do usuário → ABERTO (CHAMA DIRETAMENTE O CONTROLLER, SEM AUTORIZAÇÃO)
userRoutes.post("/user/login", userController.loginUser);

// 7. Rota de autorização extra (ajustada para chamar o controller sem o middleware)
userRoutes.post("/user/auth", userController.loginUser) 

export default userRoutes;
