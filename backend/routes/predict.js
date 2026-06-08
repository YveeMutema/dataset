const express = require('express');
const auth = require('../middleware/auth');
const { handlePrediction } = require('../controllers/predictController');
const router = express.Router();

router.post('/', auth, handlePrediction);

module.exports = router;
