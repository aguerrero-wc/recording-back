const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Crea un nuevo registro de grabación en la base de datos
 */
async function createRecording({
  uploadId,
  fileName,
  originalSize,
  mimeType,
  r2Key,
  r2Url,
  duration = null,
  status = 'uploaded'
}) {
  try {
    const recording = await prisma.recording.create({
      data: {
        uploadId,
        fileName,
        originalSize,
        mimeType,
        r2Key,
        r2Url,
        duration,
        status
      }
    });
    
    return recording;
  } catch (error) {
    console.error('Error creando grabación:', error);
    throw new Error('Error al guardar grabación en la base de datos');
  }
}

/**
 * Lista todas las grabaciones ordenadas por fecha de creación (más recientes primero)
 */
async function listRecordings({ page = 1, limit = 10, status = null } = {}) {
  try {
    const skip = (page - 1) * limit;
    
    const where = status ? { status } : {};
    
    const [recordings, total] = await Promise.all([
      prisma.recording.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.recording.count({ where })
    ]);
    
    return {
      recordings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error('Error listando grabaciones:', error);
    throw new Error('Error al obtener grabaciones de la base de datos');
  }
}

/**
 * Obtiene una grabación por su ID
 */
async function getRecordingById(id) {
  try {
    const recording = await prisma.recording.findUnique({
      where: { id: parseInt(id) }
    });
    
    return recording;
  } catch (error) {
    console.error('Error obteniendo grabación:', error);
    throw new Error('Error al obtener grabación de la base de datos');
  }
}

/**
 * Obtiene una grabación por su uploadId
 */
async function getRecordingByUploadId(uploadId) {
  try {
    const recording = await prisma.recording.findUnique({
      where: { uploadId }
    });
    
    return recording;
  } catch (error) {
    console.error('Error obteniendo grabación por uploadId:', error);
    throw new Error('Error al obtener grabación de la base de datos');
  }
}

/**
 * Actualiza el estado de una grabación
 */
async function updateRecordingStatus(id, status) {
  try {
    const recording = await prisma.recording.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    
    return recording;
  } catch (error) {
    console.error('Error actualizando estado de grabación:', error);
    throw new Error('Error al actualizar grabación en la base de datos');
  }
}

module.exports = {
  createRecording,
  listRecordings,
  getRecordingById,
  getRecordingByUploadId,
  updateRecordingStatus
};
