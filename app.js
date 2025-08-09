const express = require('express');
require('dotenv').config();

// Importar rutas
const databaseRoutes = require('./routes/database');
const r2Routes = require('./routes/r2');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Servidor Express.js con Supabase conectado',
    version: '1.0.0',
    endpoints: {
      'GET /': 'Información principal',
      'GET /api/database/test': 'Probar conexión a Supabase',
      'GET /api/database/info': 'Información de la base de datos',
      'GET /api/database/query': 'Ejecutar consulta simple'
    }
  });
});

// Usar las rutas de base de datos
app.use('/api/database', databaseRoutes);
// Rutas de Cloudflare R2
app.use('/api/r2', r2Routes);

// Middleware para manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware para manejo de errores generales
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🌟 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Probar conexión: http://localhost:${PORT}/api/database/test`);
  console.log(`ℹ️  Información DB: http://localhost:${PORT}/api/database/info`);
  console.log(`🔍 Consulta simple: http://localhost:${PORT}/api/database/query`);
  console.log(`📝 Subir .txt a R2: POST http://localhost:${PORT}/api/r2/upload-txt`);
});

module.exports = app;
