// Importa el paquete mysql2
const mysql = require('mysql2');

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Cambia si tu usuario MySQL es distinto
    password: '1234',       // Cambia si tu contraseña es distinta
    database: 'musicalendaria' // Nombre de la base de datos
});

// Intentar conectar
connection.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
    } else {
        console.log('✅ Conexión a la base de datos MySQL exitosa.');
    }
});

// Exporta la conexion para usarla en controladores
module.exports = connection;

