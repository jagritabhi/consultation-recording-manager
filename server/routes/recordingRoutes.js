const express = require('express');
const router = express.Router();
const {
  getRecordings,
  getRecordingById,
  createRecording,
  updateRecording,
  deleteRecording
} = require('../controllers/recordingController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Apply JWT protection middleware to all recording routes
router.use(protect);

// Routes
router.route('/')
  .get(getRecordings)
  .post(upload.single('audio'), createRecording);

router.route('/:id')
  .get(getRecordingById)
  .put(upload.single('audio'), updateRecording)
  .delete(deleteRecording);

module.exports = router;
