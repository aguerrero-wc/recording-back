const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/r2');

const uploadHardcodedText = async (req, res) => {
  try {
    console.log('🔍 R2_BUCKET:', process.env.R2_BUCKET_NAME);
    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) {
      return res.status(400).json({
        success: false,
        message: 'Falta la variable de entorno R2_BUCKET en .env',
      });
    }

    const key = `test-${Date.now()}.txt`;
    const body = 'Hola desde Cloudflare R2 usando la API S3 (archivo .txt hardcodeado).';

    const result = await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: 'text/plain; charset=utf-8',
        CacheControl: 'no-cache',
      })
    );

    console.log('🔍 Resultado de la subida:', result);

    const publicBase = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
    const publicUrl = `${publicBase}/${bucket}/${encodeURIComponent(key)}`;

    return res.status(200).json({
      success: true,
      message: 'Archivo .txt subido correctamente a R2',
      bucket,
      key,
      url: publicUrl,
    });
  } catch (error) {
    console.error('Error subiendo a R2:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al subir archivo a R2',
      error: error.message,
    });
  }
};

module.exports = { uploadHardcodedText };


