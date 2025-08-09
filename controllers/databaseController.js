const prisma = require('../config/prisma');

// Controlador para probar la conexión a la base de datos usando Prisma
const testDatabaseConnection = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW() AS now`;
    const now = Array.isArray(result) && result.length > 0 ? result[0].now : null;
    res.status(200).json({
      success: true,
      message: 'Conexión a Supabase (Prisma) establecida correctamente',
      timestamp: now || new Date().toISOString(),
      database: 'Supabase PostgreSQL'
    });
  } catch (error) {
    console.error('Error en testDatabaseConnection (Prisma):', error);
    res.status(500).json({
      success: false,
      message: 'Error al conectar con la base de datos',
      error: error.message
    });
  }
};

// Controlador para obtener información de la base de datos
const getDatabaseInfo = async (req, res) => {
  try {
    const versionRows = await prisma.$queryRaw`SELECT version() AS version`;
    const databasesRows = await prisma.$queryRaw`SELECT datname FROM pg_database WHERE datistemplate = false`;
    const tablesRows = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;

    res.status(200).json({
      success: true,
      databaseInfo: {
        version: versionRows?.[0]?.version,
        databases: (databasesRows || []).map(r => r.datname),
        publicTables: (tablesRows || []).map(r => r.table_name),
        connectionTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error en getDatabaseInfo (Prisma):', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información de la base de datos',
      error: error.message
    });
  }
};

// Controlador para ejecutar una consulta simple
const executeSimpleQuery = async (req, res) => {
  try {
    const rows = await prisma.$queryRaw`SELECT NOW() AS current_time, 'Hello from Supabase!' AS message`;
    const data = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    res.status(200).json({
      success: true,
      message: 'Consulta ejecutada correctamente (Prisma)',
      data
    });
  } catch (error) {
    console.error('Error en executeSimpleQuery (Prisma):', error);
    res.status(500).json({
      success: false,
      message: 'Error al ejecutar la consulta',
      error: error.message
    });
  }
};

module.exports = {
  testDatabaseConnection,
  getDatabaseInfo,
  executeSimpleQuery
};
