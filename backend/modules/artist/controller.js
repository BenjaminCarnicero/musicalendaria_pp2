// controller.js — Lógica de negocio para la entidad "artist".
// Se encarga de comunicarse con la capa de datos (DB/mysql.js)
// y devolver los resultados al router, que luego responde al cliente HTTP.

const db = require('../../db/db'); // Importamos las funciones de acceso a MySQL
const TABLE = 'artistas'; // Nombre de la tabla en la base de datos

// --- READ: obtener todos los artistas ---
async function getAllArtists() {
    // Devuelve todos los registros de la tabla "artist"
    return db.list(TABLE);
}

// --- READ: obtener un artista por ID ---
async function getArtistById(id) {
    // Busca en la tabla "artist" el registro cuyo id coincida
    return db.get(TABLE, id);
}

// --- CREATE: agregar un nuevo artista ---
async function addArtist(data) {
    // Inserta un nuevo artista en la tabla "artist".
    // Si el ID ya existe, se actualiza (gracias al ON DUPLICATE KEY UPDATE del método add)
    return db.insert(TABLE, data);
}

// --- DELETE: eliminar un artista ---
async function deleteArtist(data) {
    // Elimina un artista según el id recibido en data.id
    return db.remove(TABLE, data);
}

// --- UPDATE: actualizar información de un artista ---
async function updateArtist(id, data) {
    // Realiza un UPDATE explícito para modificar los campos del artista
    await db.queryRaw('UPDATE artistas SET ? WHERE id = ?', [data, id]);

    // Luego selecciona el artista actualizado para devolverlo al frontend
    const updated = await db.queryRaw('SELECT * FROM artistas WHERE id = ?', [id]);
    return updated;
}

// Exportamos las funciones para que sean usadas en routes.js
module.exports = {
    getAllArtists,
    getArtistById,
    addArtist,
    deleteArtist,
    updateArtist
};
