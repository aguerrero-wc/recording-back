const fs = require('fs');
const path = require('path');
const { finalizeMultipartUpload, uploadChunkPart } = require('../services/r2ChunksService');

// Almacén temporal en disco para chunks (simple). En producción, preferir Redis/DB o R2 multipart directo.
const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'tmp_uploads');
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

// POST /api/upload-chunk
const uploadChunk = async (req, res) => {
  try {
    const { chunkIndex, totalChunks, uploadId, fileName, mimeType } = req.body;

    if (!req.file || !uploadId || !fileName || typeof chunkIndex === 'undefined' || !totalChunks) {
      return res.status(400).json({ success: false, message: 'Datos de chunk incompletos' });
    }

    const uploadDir = path.join(TEMP_UPLOAD_DIR, uploadId);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const chunkPath = path.join(uploadDir, `${chunkIndex}.part`);
    await fs.promises.rename(req.file.path, chunkPath);

    return res.status(200).json({
      success: true,
      message: 'Chunk recibido',
      uploadId,
      chunkIndex: Number(chunkIndex),
      totalChunks: Number(totalChunks),
      fileName,
      mimeType,
    });
  } catch (error) {
    console.error('Error en uploadChunk:', error);
    return res.status(500).json({ success: false, message: 'Error subiendo chunk', error: error.message });
  }
};

// POST /api/complete-upload
const completeUpload = async (req, res) => {
  try {
    const { uploadId, totalChunks, fileName, mimeType, totalSize } = req.body;
    if (!uploadId || !totalChunks || !fileName) {
      return res.status(400).json({ success: false, message: 'Datos incompletos para completar subida' });
    }

    const uploadDir = path.join(TEMP_UPLOAD_DIR, uploadId);
    const exists = fs.existsSync(uploadDir);
    if (!exists) {
      return res.status(404).json({ success: false, message: 'UploadId no encontrado' });
    }

    // Subir a R2 usando multipart simulado: concatenar y enviar como stream
    const sortedParts = Array.from({ length: Number(totalChunks) }, (_, i) => path.join(uploadDir, `${i}.part`));
    for (const partPath of sortedParts) {
      if (!fs.existsSync(partPath)) {
        return res.status(400).json({ success: false, message: `Falta chunk ${path.basename(partPath)}` });
      }
    }

    const result = await finalizeMultipartUpload({
      partsPaths: sortedParts,
      fileName,
      mimeType: mimeType || 'application/octet-stream',
    });

    // Limpieza
    try {
      for (const partPath of sortedParts) {
        await fs.promises.unlink(partPath);
      }
      await fs.promises.rmdir(uploadDir);
    } catch (_) {}

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error en completeUpload:', error);
    return res.status(500).json({ success: false, message: 'Error completando subida', error: error.message });
  }
};

module.exports = { uploadChunk, completeUpload };


