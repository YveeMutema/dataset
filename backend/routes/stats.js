const express = require('express');
const auth = require('../middleware/auth');
const { getStats } = require('../controllers/statsController');
const router = express.Router();

router.get('/', auth, getStats);

module.exports = router;
