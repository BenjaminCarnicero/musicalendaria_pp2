// Importamos dependencias principales
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importamos conexión a la base de datos y middlewares propios
const { connection } = require('./db/db');
const errores = require('./middlewares/errors');

// Importamos módulos de rutas
const authRoutes = require('./modules/auth');
const artistRoutes = require('./modules/artist');
const eventRoutes = require('./modules/events');

// Creamos la app de Express
const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES GLOBALES ---
app.use(cors());                // Habilita CORS
app.use(express.json());        // Permite leer JSON en req.body

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Hacer pública la carpeta de imágenes (si existe)
app.use('/img', express.static(path.join(__dirname, 'img')));

// // --- CONEXIÓN A LA BASE DE DATOS ---
// connection.connect(err => {
//   if (err) {
//     console.error('❌ Error al conectar con MySQL:', err);
//   } else {
//     console.log('✅ Conectado a MySQL');
//   }
// });

// --- RUTAS PRINCIPALES ---
app.use('/api/auth', authRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/events', eventRoutes);


app.get('/', (req, res) => {
  res.redirect('/html/billboard.html');
});

// --- MANEJO CENTRALIZADO DE ERRORES ---
app.use(errores);

// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
