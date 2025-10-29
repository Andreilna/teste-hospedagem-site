import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gender: {
    type: String,
    enum: ['masculino', 'feminino', 'outro'],
    required: true
  },
    //Caminho para upload de imagens:
    profileImage: { type: String, default: "front-end/uploads/profile/arquivo.png" },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;