// controller.js — Lógica de negocio para la entidad "event".
// Se comunica con la capa de datos (DB/mysql.js)
// y maneja todas las operaciones relacionadas con los eventos.

const db = require('../../db/db'); // Importa las funciones para operar con MySQL
const TABLE = 'eventos'; // Nombre de la tabla en la base de datos

// --- READ: obtener todos los eventos ---
async function getAllEvents() {
    // Devuelve todos los registros de la tabla "event"
    return db.list(TABLE);
}

// --- READ: obtener un evento por ID ---
async function getEventById(id) {
    // Busca en la tabla "event" el registro cuyo id coincida
    return db.get(TABLE, id);
}

// --- CREATE: crear un nuevo evento ---
async function addEvent(data) {
    // Inserta un nuevo evento en la tabla "event"
    // Si el ID existe, se actualiza (ON DUPLICATE KEY UPDATE)
    return db.add(TABLE, data);
}

// --- UPDATE: actualizar un evento existente ---
async function updateEvent(id, data) {
    // Realiza un UPDATE explícito para modificar los campos del evento
    await db.queryRaw('UPDATE eventos SET ? WHERE id = ?', [data, id]);

    // Luego selecciona el evento actualizado y lo devuelve
    const updated = await db.queryRaw('SELECT * FROM event WHERE id = ?', [id]);
    return updated;
}

// --- DELETE: eliminar un evento ---
async function deleteEvent(data) {
    // Elimina un evento según el id recibido en data.id
    return db.remove(TABLE, data);
}

// Exportamos las funciones para que sean utilizadas por routes.js
module.exports = {
    getAllEvents,
    getEventById,
    addEvent,
    updateEvent,
    deleteEvent
};
