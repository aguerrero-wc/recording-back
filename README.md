# back-records

Backend minimal con Express.js (JS) + Supabase PostgreSQL.

## Requisitos
- Node.js 18+
- npm o pnpm o yarn

## Configuración
1. Crea un archivo `.env` en la raíz con:
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.wcigfmrtuqubvgprsaxa.supabase.co:5432/postgres
PORT=3000
```

2. Instala dependencias:
```
npm install
```

3. Inicia el servidor:
```
npm start
```

## Endpoints
- `GET /` → Información del servicio
- `GET /api/database/test` → Probar conexión a Supabase
- `GET /api/database/info` → Info de la base de datos
- `GET /api/database/query` → Consulta simple (NOW)

## Notas
- La conexión usa SSL (`rejectUnauthorized: false`) por compatibilidad con Supabase.
- Usa exclusivamente `DATABASE_URL` para la conexión.
