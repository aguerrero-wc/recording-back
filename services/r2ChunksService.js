const fs = require('fs');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/r2');

/**
 * Sube el archivo final a R2 concatenando partes locales en un stream.
 * Nota: Para archivos muy grandes, usar multipart nativo de S3 (CreateMultipartUpload/UploadPart/CompleteMultipartUpload).
 */
async function finalizeMultipartUpload({ partsPaths, fileName, mimeType }) {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error('Falta R2_BUCKET_NAME');
  }

  // Crear stream de lectura concatenado
  const readStreams = partsPaths.map((p) => fs.createReadStream(p));

  // Implementar un simple stream combinando lecturas secuenciales
  const { PassThrough } = require('stream');
  const combined = new PassThrough();

  (async () => {
    try {
      for (const rs of readStreams) {
        await new Promise((resolve, reject) => {
          rs.on('error', reject);
          rs.on('end', resolve);
          rs.pipe(combined, { end: false });
        });
      }
      combined.end();
    } catch (err) {
      combined.destroy(err);
    }
  })();

  const objectKey = `uploads/${new Date().toISOString().slice(0, 10)}/${Date.now()}_${fileName}`;

  const result = await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: combined,
      ContentType: mimeType,
      CacheControl: 'no-cache',
    })
  );

  const publicBase = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
  const url = `${publicBase}/${bucket}/${encodeURIComponent(objectKey)}`;

  return { bucket, key: objectKey, url, etag: result.ETag };
}

module.exports = { finalizeMultipartUpload };


