// // Cargamos las variables de entorno desde .env
// require('dotenv').config();

// Importamos los módulos necesarios
const express = require('express');              // Framework para crear el servidor
const session = require('express-session');      // Para manejar sesiones de usuario
const cors = require('cors');                    // Para permitir peticiones desde otro origen (como el frontend)
const app = express();                           // Creamos la app de Express

// Importamos las rutas de autenticación (login)




// Usamos la variable de entorno PORT o 3000 si no está definida
const PORT = process.env.PORT || 3000;

// === Middlewares ===
// Habilitamos CORS para que el frontend pueda hacer peticiones
app.use(cors());

// Para que el servidor entienda JSON en los cuerpos de las peticiones
app.use(express.json());

// Para que entienda formularios enviados con enctype: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión del usuario
app.use(session({
    secret: 'claveSuperSecreta',     // Clave para firmar la cookie de sesión
    resave: false,                   // No vuelve a guardar la sesión si no hubo cambios
    saveUninitialized: true          // Guarda la sesión aunque no tenga datos todavía
}));


// === Rutas ===
// Cualquier ruta que empiece con /api se maneja con las rutas del auth
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// app.use(express.static(path.join(__dirname, '..', 'frontend')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
// });
// const artistRoutes = require('./routes/artistRoutes');
// app.use('/api/artist', artistRoutes);

// // Ruta simple para probar que el servidor anda
app.get('/', (req, res) => {
     res.send('Servidor andando');
});

// Ponemos a escuchar el servidor en el puerto indicado
app.listen(PORT, () => {
    console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});


