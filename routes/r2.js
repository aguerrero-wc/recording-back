const express = require('express');
const router = express.Router();
const { uploadHardcodedText } = require('../controllers/r2Controller');

router.post('/upload-txt', uploadHardcodedText);

module.exports = router;


