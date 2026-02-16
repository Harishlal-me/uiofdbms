
const express = require('express');
const router = express.Router();
const { createFoundReport, getAllFoundReports, getFoundReportById } = require('../controllers/foundController');

const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('image'), createFoundReport);
router.get('/', getAllFoundReports);
router.get('/:id', getFoundReportById);

module.exports = router;
