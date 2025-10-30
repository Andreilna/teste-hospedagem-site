import 'dotenv/config'; // ✅ Carrega variáveis de ambiente (.env)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";

import Hortalica from "./models/Hortalica.js";
import User from "./models/User.js";
import userRoutes from "./routes/userRoutes.js";
import hortalicaRoutes from "./routes/hortalicaRoutes.js";
import waterLevelRoutes from "./routes/waterLevelRoutes.js";
import moongoose from "./config/db-connections.js";

const app = express();

// ✅ Middleware CORS manual (funciona mesmo quando o Render bloqueia preflight)
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://greenrise-by-ceres.vercel.app",
    "http://localhost:3000"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Middleware padrão do Express
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ Suas rotas
app.use("/", userRoutes);
app.use("/", hortalicaRoutes);
app.use("/", waterLevelRoutes);

// ✅ Caminho absoluto para arquivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "..", "front-end", "uploads");

app.use("/uploads", express.static(staticPath));
console.log("📁 Servindo arquivos estáticos de:", staticPath);

// ✅ Rota principal
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const hortalicas = await Hortalica.find();
    res.status(200).json({
      message: "✅ Rota Index Funcionando",
      users,
      hortalicas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Erro interno do servidor (requisição tudo junto)" });
  }
});

// ✅ Middleware para rotas não encontradas
app.use((req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
    message: `A rota ${req.method} ${req.originalUrl} não existe`,
    timestamp: new Date().toISOString(),
  });
});

// ✅ Porta configurável via Render (ou 4000 local)
const port = process.env.PORT || 4000;
app.listen(port, (error) => {
  if (error) {
    console.error(`❌ Erro na porta ${port}`, error);
  } else {
    console.log(`✅ API Greenrise Back-end rodando em http://localhost:${port}`);
  }
});