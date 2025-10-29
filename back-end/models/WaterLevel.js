import mongoose from 'mongoose';

const waterLevelSchema = new mongoose.Schema({
  nivel_agua: {
    type: Number,
    required: true,
    min: 0,
    max: 200
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

const WaterLevel = mongoose.model('WaterLevel', waterLevelSchema);

export default WaterLevel;
