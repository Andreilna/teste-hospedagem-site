import 'dotenv/config'; // ✅ Carregar variáveis de ambiente (.env)
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Importar conexões e modelos
import mongooseConnection from "./config/db-connections.js";
import Hortalica from "./models/Hortalica.js";
import User from "./models/User.js";

// Importar rotas
import userRoutes from "./routes/userRoutes.js";
import hortalicaRoutes from "./routes/hortalicaRoutes.js";
import waterLevelRoutes from "./routes/waterLevelRoutes.js";

const app = express();

// ✅ Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ Configuração CORS (aceita acesso do front-end da Vercel)
app.use(cors({
  origin: [
    "http://localhost:3000",                // Para teste local
    "https://greenrise.vercel.app",         // Caso use este domínio
    "https://greenrise-by-ceres.vercel.app",// Front hospedado
    "https://equipe-ceres.vercel.app"       // Outro domínio vinculado
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Rotas principais
app.use("/", userRoutes);
app.use("/", hortalicaRoutes);
app.use("/", waterLevelRoutes);

// ✅ Caminho absoluto para arquivos estáticos (uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "..", "front-end", "uploads");

app.use("/uploads", express.static(staticPath));
console.log("📂 Servindo arquivos estáticos de:", staticPath);

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
    console.error("❌ Erro interno do servidor:", error);
    res.status(500).json({ error: "❌ Erro interno do servidor (rota /)" });
  }
});

// ✅ Middleware para rotas não encontradas
app.use((req, res) => {
  console.log(`⚠️ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
    message: `A rota ${req.method} ${req.originalUrl} não existe`,
    timestamp: new Date().toISOString(),
  });
});

// ✅ Inicializar servidor
const port = process.env.PORT || 4000;
app.listen(port, (error) => {
  if (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
  } else {
    console.log(`✅ API Greenrise rodando em http://localhost:${port}`);
  }
});