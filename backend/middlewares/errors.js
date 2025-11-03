// Middleware centralizado para manejar errores en toda la app.
// Se coloca al final de todas las rutas en server.js (app.use(errors)).

function errors(err, req, res, next) {
    // Mostrar el error en consola (útil para depurar en desarrollo)
    console.error('[Error]', err);

    // Si el error tiene un código de estado definido, se usa; si no, se asigna 500 (error interno)
    const status = err.statusCode || 500;

    // Si el error tiene mensaje se usa, si no, se muestra uno genérico
    const message = err.message || 'Internal server error';

    // Enviar respuesta en formato JSON (legible por el frontend)
    res.status(status).json({
        error: true,
        message
    });
}

// Exportar el middleware para usarlo en server.js
module.exports = errors;
