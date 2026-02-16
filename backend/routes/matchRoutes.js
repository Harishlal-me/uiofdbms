
const express = require('express');
const router = express.Router();
const { getAllMatches, verifyMatch, getUserMatches, getMatchById } = require('../controllers/matchController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAllMatches); // Admin only
router.get('/user', protect, getUserMatches); // Authenticated User
router.get('/:id', protect, getMatchById); // Get single match for claim page
router.put('/:id/verify', protect, admin, verifyMatch);

module.exports = router;
