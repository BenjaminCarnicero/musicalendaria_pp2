// backend/utils/customError.js

// Función para crear errores personalizados con mensaje y codigo
function customError(message, code) {
    // Creamos un objeto de tipo Error
    const e = new Error(message);

    // Si se pasa un codigo de estado HTTP, lo agregamos al error
    if (code) {
        e.statusCode = code; // Ejemplo: 400 (Bad Request), 404 (Not Found)
    }

    // Retornamos el error listo para lanzar
    return e;
}

// Exportamos la funcion para poder usarla en los controladores
module.exports = customError;

/*
    Este modulo permite crear errores personalizados 
    con un mensaje y un codigo de estado HTTP.
    Se usa dentro de controladores o servicios cuando 
    queremos forzar un error específico, por ejemplo:
    
    throw customError("Usuario no encontrado", 404);
*/
