const Prediction = require('../models/Prediction');

exports.getHistory = async (req, res) => {
  try {
    const history = await Prediction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch history', error: error.message });
  }
};
