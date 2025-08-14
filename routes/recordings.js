const express = require('express');
const router = express.Router();
const {
  getAllRecordings,
  getRecording,
  getRecordingByUpload,
  updateStatus
} = require('../controllers/recordingsController');

// GET /api/recordings - Lista todas las grabaciones con paginación
// Query params: ?page=1&limit=10&status=uploaded
router.get('/', getAllRecordings);

// GET /api/recordings/:id - Obtiene una grabación por ID
router.get('/:id', getRecording);

// GET /api/recordings/upload/:uploadId - Obtiene una grabación por uploadId
router.get('/upload/:uploadId', getRecordingByUpload);

// PATCH /api/recordings/:id/status - Actualiza el estado de una grabación
// Body: { "status": "processing" }
router.patch('/:id/status', updateStatus);

module.exports = router;
