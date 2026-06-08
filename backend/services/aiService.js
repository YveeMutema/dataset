const axios = require('axios');
const { predictSymptoms: predictSymptomsViaJava } = require('./javaService');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const normalizeSymptomKey = (key) => key.replace(/_/g, ' ');

const buildSymptomDescription = (symptoms, customSymptoms) => {
  const knownSymptoms = Object.entries(symptoms)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => normalizeSymptomKey(key));

  const parts = [];
  if (knownSymptoms.length) {
    parts.push(`Known symptoms: ${knownSymptoms.join(', ')}.`);
  }
  if (customSymptoms.length) {
    parts.push(`Additional symptoms: ${customSymptoms.join(', ')}.`);
  }
  return parts.join(' ');
};

const extractJson = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  const jsonText = match[0].replace(/\s+\n/g, ' ').trim();
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    return null;
  }
};

exports.predictSymptoms = async (symptoms, customSymptoms = []) => {
  // If no OpenAI key configured, use local Java predictor
  if (!OPENAI_API_KEY) {
    return predictSymptomsViaJava(symptoms, customSymptoms);
  }

  const symptomDescription = buildSymptomDescription(symptoms, customSymptoms);
  const systemPrompt = `You are a rural health diagnostics assistant for Hurungwe District, Zimbabwe. The user provides patient symptoms from a rural setting. Identify the most likely disease and provide follow-up advice that is safe and practical for rural patients.`;
  const userPrompt = `Patient symptoms: ${symptomDescription}

Return only valid JSON without any extra commentary. The JSON must include these keys:
- disease (string)
- confidence (number between 0 and 100)
- risk (low, medium, or high)
- advice (string)
- topPredictions (array of objects with disease and confidence)
- explanation (string)`;

  try {
    const response = await axios.post(
      OPENAI_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 400
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rawText = response.data?.choices?.[0]?.message?.content || '';
    const parsed = extractJson(rawText);

    if (!parsed) {
      throw new Error('Unable to parse AI response from OpenAI.');
    }

    return {
      disease: parsed.disease || 'Unknown',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : Number(parsed.confidence) || 0,
      risk: parsed.risk || 'medium',
      advice: parsed.advice || 'Please consult a local health worker for a more accurate diagnosis.',
      topPredictions: Array.isArray(parsed.topPredictions) ? parsed.topPredictions : [],
      explanation: parsed.explanation || ''
    };
  } catch (err) {
    // If OpenAI fails (invalid key, network, etc.), fall back to the local Java predictor
    console.error('OpenAI call failed, falling back to Java predictor:', err.message || err);
    return predictSymptomsViaJava(symptoms, customSymptoms);
  }
};
