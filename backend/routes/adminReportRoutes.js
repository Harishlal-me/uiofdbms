
const express = require('express');
const router = express.Router();
const { getResolvedCases, generateCasePDF } = require('../controllers/adminReportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/closed', protect, admin, getResolvedCases);
router.get('/:id/pdf', protect, admin, generateCasePDF);

module.exports = router;
