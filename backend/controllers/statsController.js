const Prediction = require('../models/Prediction');

exports.getStats = async (req, res) => {
  try {
    const diseaseStats = await Prediction.aggregate([
      { $group: { _id: '$disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const riskStats = await Prediction.aggregate([
      { $group: { _id: '$risk', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ diseaseStats, riskStats });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch stats', error: error.message });
  }
};
