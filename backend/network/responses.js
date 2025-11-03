// Función para enviar respuestas exitosas al cliente.
// Se usa cuando la operación se realiza correctamente.
exports.success = function (req, res, message = '', status = 200) {
    res.status(status).send({
        error: false,     // indica que no hubo error
        status: status,   // código HTTP (200, 201, etc.)
        body: message     // cuerpo de la respuesta (mensaje o datos)
    });
};

// Función para enviar respuestas con error.
// Se usa cuando ocurre alguna excepción o problema.
exports.error = function (req, res, message = 'Internal error', status = 500) {
    res.status(status).send({
        error: true,      // indica que hubo error
        status: status,   // código HTTP (400, 500, etc.)
        body: message     // cuerpo con el mensaje de error
    });
};
