# 🌱 Greenrise - API Backend

API RESTful desenvolvida em Node.js para gerenciamento de hortaliças e usuários.

## 🚀 Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Banco de Dados:** MongoDB com Mongoose
- **Autenticação:** JWT (JSON Web Tokens)
- **Segurança:** BCrypt para criptografia
- **Upload:** Multer para imagens

## 📋 Funcionalidades

### 👤 Módulo de Usuários
- ✅ Cadastro de usuários com upload de imagem
- ✅ Sistema de login com autenticação JWT
- ✅ CRUD completo de usuários

### 🌿 Módulo de Hortaliças
- ✅ Cadastro de hortaliças vinculadas ao usuário
- ✅ CRUD completo de hortaliças
- ✅ Campos: nome, tipo, tempo de cultivo, fertilizantes

### 🔐 Segurança
- ✅ Autenticação via JWT
- ✅ Senhas criptografadas com BCrypt
- ✅ Middleware de proteção de rotas

## 🛠 Como Usar

### Pré-requisitos
- Node.js (v18 ou superior)
- MongoDB
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [https://github.com/erlonviana/pi_dsm3_backend.git](https://github.com/Richardo-o/pi_3_semestre_react.git)

# Acesse a pasta do backend
cd pi_3_semestre_react/back-end

# Instale as dependências
npm install

# Execute a aplicação
npm start
