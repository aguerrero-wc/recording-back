const { 
  listRecordings, 
  getRecordingById, 
  getRecordingByUploadId,
  updateRecordingStatus 
} = require('../services/recordingsService');

/**
 * GET /api/recordings - Lista todas las grabaciones con paginación
 */
const getAllRecordings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const result = await listRecordings({
      page: parseInt(page),
      limit: parseInt(limit),
      status: status || null
    });
    
    return res.status(200).json({
      success: true,
      data: result.recordings,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error obteniendo grabaciones:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener grabaciones',
      error: error.message
    });
  }
};

/**
 * GET /api/recordings/:id - Obtiene una grabación por ID
 */
const getRecording = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID de grabación inválido'
      });
    }
    
    const recording = await getRecordingById(id);
    
    if (!recording) {
      return res.status(404).json({
        success: false,
        message: 'Grabación no encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: recording
    });
  } catch (error) {
    console.error('Error obteniendo grabación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener grabación',
      error: error.message
    });
  }
};

/**
 * GET /api/recordings/upload/:uploadId - Obtiene una grabación por uploadId
 */
const getRecordingByUpload = async (req, res) => {
  try {
    const { uploadId } = req.params;
    
    if (!uploadId) {
      return res.status(400).json({
        success: false,
        message: 'UploadId requerido'
      });
    }
    
    const recording = await getRecordingByUploadId(uploadId);
    
    if (!recording) {
      return res.status(404).json({
        success: false,
        message: 'Grabación no encontrada para este uploadId'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: recording
    });
  } catch (error) {
    console.error('Error obteniendo grabación por uploadId:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener grabación',
      error: error.message
    });
  }
};

/**
 * PATCH /api/recordings/:id/status - Actualiza el estado de una grabación
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID de grabación inválido'
      });
    }
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Estado requerido'
      });
    }
    
    const validStatuses = ['uploaded', 'processing', 'completed', 'error'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}`
      });
    }
    
    const recording = await updateRecordingStatus(id, status);
    
    return res.status(200).json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: recording
    });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar estado',
      error: error.message
    });
  }
};

module.exports = {
  getAllRecordings,
  getRecording,
  getRecordingByUpload,
  updateStatus
};
