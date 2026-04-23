const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { registerUser } = require('../controllers/authController');
const { loginUser } = require('../controllers/authController');
const { verifyEmail } = require('../controllers/authController');
const { getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.get("/me", protect, getMe);


module.exports = router;