const express = require('express');
const { handlePrediction } = require('../controllers/predictController');
const router = express.Router();

router.post('/', handlePrediction);

module.exports = router;
