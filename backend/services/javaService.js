const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:9000/predict';

exports.predictSymptoms = async (symptoms) => {
  const payload = {
    symptoms: {
      fever: symptoms.fever ? 1 : 0,
      headache: symptoms.headache ? 1 : 0,
      cough: symptoms.cough ? 1 : 0,
      vomiting: symptoms.vomiting ? 1 : 0,
      diarrhoea: symptoms.diarrhoea ? 1 : 0,
      chest_pain: symptoms.chest_pain ? 1 : 0,
      chills: symptoms.chills ? 1 : 0,
      weakness: symptoms.weakness ? 1 : 0,
      skin_rash: symptoms.skin_rash ? 1 : 0,
      difficulty_breathing: symptoms.difficulty_breathing ? 1 : 0
    }
  };

  const response = await axios.post(AI_SERVICE_URL, payload, {
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  });

  return response.data;
};
