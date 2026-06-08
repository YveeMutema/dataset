const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:9000/predict';

const symptomSynonyms = {
  fever: ['fever', 'temperature', 'hot', 'febrile', 'high temp', 'feverish'],
  headache: ['headache', 'head pain', 'migraine', 'head hurts'],
  cough: ['cough', 'coughing', 'dry cough', 'wet cough'],
  vomiting: ['vomit', 'vomiting', 'nausea', 'throw up', 'throwing up'],
  diarrhoea: ['diarrhoea', 'diarrhea', 'loose stool', 'watery stool', 'runny stool'],
  chest_pain: ['chest pain', 'pain in chest', 'tightness', 'heart pain', 'chest discomfort'],
  chills: ['chills', 'shivering', 'cold chills', 'cold sweats'],
  weakness: ['weakness', 'fatigue', 'tired', 'tiredness', 'weak limbs', 'muscle weakness'],
  skin_rash: ['rash', 'skin rash', 'red spots', 'itchy skin', 'blisters'],
  difficulty_breathing: ['difficulty breathing', 'shortness of breath', 'breathlessness', 'unable to breathe', 'wheezing']
};

const detectSymptomsFromText = (customSymptoms) => {
  const lowerSymptoms = customSymptoms
    .filter(Boolean)
    .map((symptom) => symptom.toLowerCase());

  return Object.keys(symptomSynonyms).reduce((result, key) => {
    result[key] = lowerSymptoms.some((symptom) =>
      symptomSynonyms[key].some((phrase) => symptom.includes(phrase))
    ) ? 1 : 0;
    return result;
  }, {});
};

const buildPayload = (symptoms, customSymptoms = []) => {
  const mappedCustom = detectSymptomsFromText(customSymptoms);

  return {
    symptoms: {
      fever: symptoms.fever || mappedCustom.fever ? 1 : 0,
      headache: symptoms.headache || mappedCustom.headache ? 1 : 0,
      cough: symptoms.cough || mappedCustom.cough ? 1 : 0,
      vomiting: symptoms.vomiting || mappedCustom.vomiting ? 1 : 0,
      diarrhoea: symptoms.diarrhoea || mappedCustom.diarrhoea ? 1 : 0,
      chest_pain: symptoms.chest_pain || mappedCustom.chest_pain ? 1 : 0,
      chills: symptoms.chills || mappedCustom.chills ? 1 : 0,
      weakness: symptoms.weakness || mappedCustom.weakness ? 1 : 0,
      skin_rash: symptoms.skin_rash || mappedCustom.skin_rash ? 1 : 0,
      difficulty_breathing: symptoms.difficulty_breathing || mappedCustom.difficulty_breathing ? 1 : 0
    }
  };
};

exports.predictSymptoms = async (symptoms, customSymptoms = []) => {
  const payload = buildPayload(symptoms, customSymptoms);

  const response = await axios.post(AI_SERVICE_URL, payload, {
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  });

  return response.data;
};
