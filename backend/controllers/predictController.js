const Prediction = require('../models/Prediction');
const { predictSymptoms } = require('../services/aiService');

exports.handlePrediction = async (req, res) => {
  try {
    const symptoms = req.body.symptoms || {};
    const customSymptoms = Array.isArray(req.body.customSymptoms) ? req.body.customSymptoms : [];

    if (Object.keys(symptoms).length === 0 && customSymptoms.length === 0) {
      return res.status(400).json({ message: 'Please provide symptoms or customSymptoms for prediction' });
    }

    const aiResult = await predictSymptoms(symptoms, customSymptoms);
    const record = await Prediction.create({
      user: req.user?.id || null,
      symptoms: {
        fever: Boolean(symptoms.fever),
        headache: Boolean(symptoms.headache),
        cough: Boolean(symptoms.cough),
        vomiting: Boolean(symptoms.vomiting),
        diarrhoea: Boolean(symptoms.diarrhoea),
        chest_pain: Boolean(symptoms.chest_pain),
        chills: Boolean(symptoms.chills),
        weakness: Boolean(symptoms.weakness),
        skin_rash: Boolean(symptoms.skin_rash),
        difficulty_breathing: Boolean(symptoms.difficulty_breathing)
      },
      customSymptoms,
      disease: aiResult.disease,
      confidence: aiResult.confidence,
      risk: aiResult.risk,
      advice: aiResult.advice,
      topPredictions: aiResult.topPredictions || [],
      explanation: aiResult.explanation || ''
    });

    res.status(200).json({ ...aiResult, recordId: record._id });
  } catch (error) {
    res.status(500).json({ message: 'Prediction failed', error: error.message });
  }
};
