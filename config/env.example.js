// Archivo de ejemplo para configurar las variables de entorno
// Copia este archivo como .env en la raíz del proyecto y reemplaza [YOUR-PASSWORD] con tu contraseña real

/*
Contenido del archivo .env:

DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.wcigfmrtuqubvgprsaxa.supabase.co:5432/postgres
DB_HOST=db.wcigfmrtuqubvgprsaxa.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
PORT=3000

*/

// También puedes configurar las variables directamente aquí para pruebas:
const config = {
  DATABASE_URL: 'postgresql://postgres:[YOUR-PASSWORD]@db.wcigfmrtuqubvgprsaxa.supabase.co:5432/postgres',
  DB_HOST: 'db.wcigfmrtuqubvgprsaxa.supabase.co',
  DB_PORT: 5432,
  DB_NAME: 'postgres',
  DB_USER: 'postgres',
  DB_PASSWORD: '[YOUR-PASSWORD]', // Reemplaza con tu contraseña real
  PORT: 3000
};

module.exports = config;
