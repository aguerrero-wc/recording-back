const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadChunk, completeUpload } = require('../controllers/r2ChunksController');

const router = express.Router();

// Multer almacenamiento temporal por archivo (chunk)
const TEMP_DIR = path.join(process.cwd(), 'tmp_uploads');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}.part`);
  },
});

const upload = multer({ storage });

// Endpoint para recibir chunks (campo: 'chunk')
router.post('/upload-chunk', upload.single('chunk'), uploadChunk);

// Endpoint para completar upload
router.post('/complete-upload', completeUpload);

module.exports = router;


