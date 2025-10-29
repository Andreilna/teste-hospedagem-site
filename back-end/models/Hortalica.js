import mongoose from 'mongoose';

const hortalicaSchema = new mongoose.Schema({
  nome_hortalica: {
    type: String,
    required: true,
    trim: true
  },
  tempo_estimado: {
    type: Number,
    default: null
  },
  tempo_real: {
    type: Number,
    default: null
  },
  tipo_hortalica: {
    type: String,
    required: true,
    trim: true
  },
  
  fertilizantes: [{
    fertilizante: {
      type: String,
      trim: true
    },
    quantidade: {
      type: Number,
      min: 0,
      default: 0
    },
    unidade: {
      type: String,
      default: 'g'
    }
  }],
  
  nivel: {
    nivel_agua: {
      type: Number,
      min: 0,
      max: 200,
      default: null
    },
    nivel_fertilizante: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // vínculo com User
}, {
  timestamps: true
});

const Hortalica = mongoose.model('Hortalica', hortalicaSchema);

export default Hortalica;