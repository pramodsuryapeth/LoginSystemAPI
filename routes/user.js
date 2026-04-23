const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/userController');

router.get('/dashboard', protect, getDashboard);

module.exports = router;