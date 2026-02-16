const express = require('express');
const router = express.Router();
const { createClaim, createConditionReport, getClaimByMatch, getAllClaims } = require('../controllers/claimController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// User Claims
router.post('/', protect, upload.single('proof_photo'), createClaim); // Submit claim with optional photo
router.get('/match/:matchId', protect, getClaimByMatch); // Check claim status for a match

// Admin Condition Reports (no file upload - uses existing owner pickup photo)
router.post('/condition', protect, admin, createConditionReport);

// Admin View All
router.get('/', protect, admin, getAllClaims);

module.exports = router;
