const fs = require('fs');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/r2');

/**
 * Sube el archivo final a R2 concatenando partes locales.
 * Concatena chunks en archivo temporal, luego sube a R2.
 */
async function finalizeMultipartUpload({ partsPaths, fileName, mimeType }) {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error('Falta R2_BUCKET_NAME');
  }

  // Crear archivo temporal para concatenar chunks
  const tempFinalFile = path.join(process.cwd(), 'tmp_uploads', `final_${Date.now()}_${fileName}`);
  const writeStream = fs.createWriteStream(tempFinalFile);

  try {
    // Concatenar todos los chunks secuencialmente
    for (const partPath of partsPaths) {
      const data = await fs.promises.readFile(partPath);
      writeStream.write(data);
    }
    writeStream.end();

    // Esperar a que termine la escritura
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Subir archivo completo a R2
    const objectKey = `${new Date().toISOString().slice(0, 10)}/${Date.now()}_${fileName}`;
    const fileBuffer = await fs.promises.readFile(tempFinalFile);
    
    const result = await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: mimeType,
        CacheControl: 'no-cache',
      })
    );

    // Limpiar archivo temporal
    await fs.promises.unlink(tempFinalFile);

    const publicBase = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
    const url = `${publicBase}/${bucket}/${encodeURIComponent(objectKey)}`;

    return { bucket, key: objectKey, url, etag: result.ETag };
  } catch (error) {
    // Limpiar archivo temporal en caso de error
    try {
      await fs.promises.unlink(tempFinalFile);
    } catch (_) {}
    throw error;
  }
}

module.exports = { finalizeMultipartUpload };


