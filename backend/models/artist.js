// Definimos el nombre de la tabla en la base de datos
const TABLE = 'artist';

module.exports = function (injectedDB) {
    // Si no se inyecta una base de datos, se usa la conexión por defecto
    let db = injectedDB;
    if (!db) {
        db = require('../../DB/db'); // Importa el conector a MySQL
    }

    // Obtiene la lista completa de artistas
    function list() {
        return db.list(TABLE);
    }

    // Obtiene un artista por su ID
    function get(id) {
        return db.get(TABLE, id);
    }

    // Agrega un nuevo artista a la base de datos
    function insert(data) {
        return db.insert(TABLE, data);
    }

    // Actualiza un artista existente
    function update(data) {
        return db.update(TABLE, data);
    }

    // Elimina un artista por su ID
    function remove(id) {
        return db.remove(TABLE, id);
    }

    // Exportamos las funciones para ser usadas en otros módulos
    return {
        list,
        get,
        insert,
        update,
        remove,
    };
};
