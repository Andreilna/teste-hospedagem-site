// back-end/middleware/Auth.js
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWTSecret = process.env.JWT_SECRET;

const Authorization = (req, res, next) => {
  // header vem sempre minúsculo no Node
  const authHeader = req.headers.authorization || "";

  // Espera "Bearer <token>"
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "❌ Token ausente ou malformado" });
  }

  if (!JWTSecret) {
    // evita crash silencioso se esquecer a env
    return res.status(500).json({ error: "Configuração ausente: JWT_SECRET" });
  }

  jwt.verify(token, JWTSecret, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "❌ Token inválido ou expirado" });
    }

    // Disponibiliza dados do usuário para as próximas camadas
    req.token = token;
    req.user = {
      id: payload.id || payload.sub,   // compatível com ambos
      email: payload.email || null,
      role: payload.role || "user",
    };

    return next();
  });
};

export default Authorization;
