# Documentação do Banco de Dados - Sistema de Fazenda Vertical
## 📋 Visão Geral

**Tecnologia:** MongoDB com Mongoose ODM  
**Descrição:** Sistema para gerenciamento de usuários e cultivo de hortaliças  
**Última atualização:** 15/01/2024

---

## 🗃️ Coleções

### 1. Coleção: Users

**Descrição:** Armazena informações dos usuários do sistema

#### Schema
```javascript
{
  _id: ObjectId,
  firstname: String,        // Nome do usuário (obrigatório)
  lastname: String,         // Sobrenome do usuário (obrigatório)
  email: String,           // E-mail único (obrigatório, lowercase)
  phoneNumber: String,     // Telefone (obrigatório)
  password: String,        // Senha (mínimo 6 caracteres)
  gender: String,          // Gênero: ['masculino', 'feminino', 'outro']
  profileImage: String,    // Caminho da imagem de perfil
  createdAt: Date,         // Data de criação (automático)
  updatedAt: Date          // Data de atualização (automático)
}
```

#### Validações e Índices
- **Índice único:** `email`
- **Validações:**
  - `firstname`, `lastname`, `email`, `phoneNumber`, `password`, `gender`: obrigatórios
  - `password`: mínimo 6 caracteres
  - `gender`: apenas valores permitidos no enum
- **Valor padrão:** `profileImage`: "front-end/uploads/profile/arquivo.png"

#### Exemplo de Documento
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  firstname: "João",
  lastname: "Silva",
  email: "joao.silva@email.com",
  phoneNumber: "(11) 99999-9999",
  password: "$2a$10$hashedpassword",
  gender: "masculino",
  profileImage: "front-end/uploads/profile/joao.png",
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T14:20:00Z")
}
```

### 2. Coleção: Hortalicas

**Descrição:** Armazena informações sobre as hortaliças cultivadas pelos usuários

#### Schema
```javascript
{
  _id: ObjectId,
  nome_hortalica: String,      // Nome da hortaliça (obrigatório)
  tempo_estimado: Number,      // Tempo estimado de cultivo (dias)
  tempo_real: Number,          // Tempo real de cultivo (dias)
  tipo_hortalica: String,      // Tipo da hortaliça (obrigatório)
  
  // Array de fertilizantes utilizados
  fertilizantes: [{
    fertilizante: String       // Nome do fertilizante
  }],
  
  // Níveis de recursos
  nivel: {
    nivel_agua: Number        // Nível de água em litros
  },
  
  // Referência ao usuário proprietário
  user: ObjectId,             // Referência à coleção Users
  
  createdAt: Date,            // Data de criação (automático)
  updatedAt: Date             // Data de atualização (automático)
}
```

#### Validações e Índices
- **Índices:**
  - `user` (para populações)
- **Validações:**
  - `nome_hortalica`, `tipo_hortalica`: obrigatórios
  - `nivel.nivel_agua`: entre 0 e 100
- **Valores padrão:**
  - `tempo_estimado`: null
  - `tempo_real`: null

#### Exemplo de Documento
```javascript
{
  _id: ObjectId("607f1f77bcf86cd799439012"),
  nome_hortalica: "Alface Crespa",
  tempo_estimado: 45,
  tempo_real: 42,
  tipo_hortalica: "Folhosa",
  fertilizantes: [
    { fertilizante: "NPK 10-10-10" },
    { fertilizante: "Composto Orgânico" }
  ],
  nivel: {
    nivel_agua: 75
  },
  user: ObjectId("507f1f77bcf86cd799439011"),
  createdAt: ISODate("2024-01-15T12:00:00Z"),
  updatedAt: ISODate("2024-01-20T09:15:00Z")
}
```

---

## 🔗 Relacionamentos

```
Users (1) ---- (N) Hortalicas
```

**Tipo:** Relacionamento One-to-Many  
**Chave estrangeira:** `Hortalica.user` → `User._id`

---

## 📊 Exemplos de Consultas

### 1. Buscar todas as hortaliças de um usuário
```javascript
const userHortalicas = await Hortalica.find({ 
  user: "507f1f77bcf86cd799439011" 
}).populate('user');
```

### 2. Buscar usuário por e-mail
```javascript
const user = await User.findOne({ 
  email: "joao.silva@email.com" 
});
```

### 3. Hortaliças com nível de água crítico
```javascript
const hortalicasCriticas = await Hortalica.find({
  "nivel.nivel_agua": { $lt: 30 }
});
```

### 4. Estatísticas de cultivo por usuário
```javascript
const stats = await Hortalica.aggregate([
  { $match: { user: ObjectId("507f1f77bcf86cd799439011") } },
  { $group: {
      _id: "$tipo_hortalica",
      total: { $sum: 1 },
      tempoMedio: { $avg: "$tempo_real" }
    }
  }
]);
```

---

## 🎯 Regras de Negócio

### Users
- E-mail deve ser único no sistema
- Senha deve ter no mínimo 6 caracteres
- Gênero deve ser um dos valores predefinidos
- Imagem de perfil tem um caminho padrão

### Hortalicas
- Cada hortaliça pertence a um usuário
- Nível de água deve estar entre 0-100%
- Pode ter múltiplos fertilizantes associados
- Tempos de cultivo são opcionais

---

## 📁 Estrutura dos Models

### User Model (`models/User.js`)
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  gender: { 
    type: String, 
    enum: ['masculino', 'feminino', 'outro'], 
    required: true 
  },
  profileImage: { 
    type: String, 
    default: "front-end/uploads/profile/arquivo.png" 
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
```

### Hortalica Model (`models/Hortalica.js`)
```javascript
import mongoose from 'mongoose';

const hortalicaSchema = new mongoose.Schema({
  nome_hortalica: { type: String, required: true, trim: true },
  tempo_estimado: { type: Number, default: null },
  tempo_real: { type: Number, default: null },
  tipo_hortalica: { type: String, required: true, trim: true },
  fertilizantes: [{
    fertilizante: { type: String, trim: true }
  }],
  nivel: {
    nivel_agua: { type: Number, min: 0, max: 100 }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
  timestamps: true
});

export default mongoose.model('Hortalica', hortalicaSchema);
```

---

## 🔄 Operações Comuns

### Criar usuário
```javascript
const newUser = await User.create({
  firstname: "Maria",
  lastname: "Santos",
  email: "maria.santos@email.com",
  phoneNumber: "(11) 98888-7777",
  password: "senha123",
  gender: "feminino"
});
```

### Adicionar hortaliça
```javascript
const newHortalica = await Hortalica.create({
  nome_hortalica: "Tomate",
  tipo_hortalica: "Fruto",
  tempo_estimado: 90,
  fertilizantes: [{ fertilizante: "Adubo Orgânico" }],
  nivel: { nivel_agua: 80 },
  user: user._id
});
```

---

## 📝 Notas de Desenvolvimento

- Utiliza Mongoose para validações e estruturação de dados
- Timestamps automáticos em ambas as coleções
- Relacionamento por referência usando ObjectId
- Estrutura preparada para expansão futura

---

**Esta documentação deve ser mantida atualizada conforme evolução do schema do banco de dados.**