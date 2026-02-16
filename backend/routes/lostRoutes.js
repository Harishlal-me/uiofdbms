
const express = require('express');
const router = express.Router();
const { createLostReport, getAllLostReports, getLostReportById } = require('../controllers/lostController');

const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('image'), createLostReport);
router.get('/', getAllLostReports);
router.get('/:id', getLostReportById);

module.exports = router;
