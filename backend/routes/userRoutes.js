const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, getMe, getUserProfile } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/profile/:id', protect, getUserProfile);
router.get('/', protect, admin, getAllUsers);

module.exports = router;
