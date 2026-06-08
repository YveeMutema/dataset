const express = require('express');
const auth = require('../middleware/auth');
const { getHistory } = require('../controllers/historyController');
const router = express.Router();

router.get('/', auth, getHistory);

module.exports = router;
