import 'dotenv/config';
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

// ⚡ CORS — versão totalmente compatível com Render + Vercel
const allowedOrigins = [
  "https://greenrise-by-ceres.vercel.app",
  "http://localhost:3000"
];

// Configuração CORS usando o pacote cors
app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex: mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Remove trailing slash para comparação
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS bloqueado para origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 horas
}));

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

// ✅ Porta configurável via Render
const port = process.env.PORT || 4000;
app.listen(port, (error) => {
  if (error) {
    console.error(`❌ Erro na porta ${port}`, error);
  } else {
    console.log(`✅ API Greenrise rodando na porta ${port}`);
  }
});
  