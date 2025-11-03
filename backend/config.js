// config.js
// Archivo central de configuración del proyecto Musicalendaria

module.exports = {
    // Configuración general de la aplicación
    app: {
        port: 3000 // Puerto donde corre el servidor Express
    },

    // Configuración de la base de datos MySQL
    mysql: {
        host: 'localhost',       // Servidor MySQL
        user: 'root',            // Usuario de tu base de datos (ajustalo si usás otro)
        password: '1234',            // Contraseña de MySQL (completala si tenés)
        database: 'musicalendaria' // Nombre exacto de tu base de datos
    },

    // Configuración para JWT
    jwt: {
        secret: 'claveSecreta' // Clave para firmar y verificar tokens
    }
};
