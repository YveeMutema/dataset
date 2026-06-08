const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: {
    fever: Boolean,
    headache: Boolean,
    cough: Boolean,
    vomiting: Boolean,
    diarrhoea: Boolean,
    chest_pain: Boolean,
    chills: Boolean,
    weakness: Boolean,
    skin_rash: Boolean,
    difficulty_breathing: Boolean
  },
  customSymptoms: [{ type: String }],
  disease: { type: String, required: true },
  confidence: { type: Number, required: true },
  risk: { type: String, required: true },
  advice: { type: String, required: true },
  topPredictions: [
    {
      disease: String,
      confidence: Number
    }
  ],
  explanation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
