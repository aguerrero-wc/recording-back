const express = require('express');
const router = express.Router();
const { 
  testDatabaseConnection, 
  getDatabaseInfo, 
  executeSimpleQuery 
} = require('../controllers/databaseController');

// Ruta para probar la conexión a la base de datos
router.get('/test', testDatabaseConnection);

// Ruta para obtener información de la base de datos
router.get('/info', getDatabaseInfo);

// Ruta para ejecutar una consulta simple
router.get('/query', executeSimpleQuery);

module.exports = router;
