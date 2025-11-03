// routes.js — Define los endpoints HTTP para la entidad "event".
// Usa el controlador para la lógica y el helper response.js para las respuestas uniformes.

const express = require('express');
const response = require('../../network/responses'); // Helper que da formato {error, status, body}
const controller = require('./eventController'); // Lógica de negocio del evento

const router = express.Router(); // Creamos un router de Express

// --- Endpoints disponibles ---
// GET    /api/events/          -> listar todos los eventos
// GET    /api/events/:id       -> obtener un evento por ID
// POST   /api/events/          -> crear un nuevo evento
// PUT    /api/events/:id       -> actualizar un evento existente
// DELETE /api/events/          -> eliminar un evento (por body.id)

router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/', removeEvent);

// --- Funciones manejadoras (controllers de las rutas) ---

async function listEvents(req, res, next) {
    try {
        // Llama al controlador para obtener todos los eventos
        const events = await controller.getAllEvents();
        response.success(req, res, events, 200);
    } catch (err) {
        next(err);
    }
}

async function getEvent(req, res, next) {
    try {
        // Busca el evento por el ID que viene en la URL (req.params.id)
        const event = await controller.getEventById(req.params.id);
        response.success(req, res, event, 200);
    } catch (err) {
        next(err);
    }
}

async function createEvent(req, res, next) {
    try {
        // Crea un nuevo evento con los datos del body
        const event = await controller.addEvent(req.body);
        response.success(req, res, event, 201);
    } catch (err) {
        next(err);
    }
}

async function updateEvent(req, res, next) {
    try {
        // Actualiza el evento con el ID recibido en la URL
        const updated = await controller.updateEvent(req.params.id, req.body);
        response.success(req, res, updated, 200);
    } catch (err) {
        next(err);
    }
}

async function removeEvent(req, res, next) {
    try {
        // Elimina el evento cuyo ID se envía en el body
        const result = await controller.deleteEvent(req.body);
        response.success(req, res, result, 200);
    } catch (err) {
        next(err);
    }
}

// Exportamos el router para que sea montado en /api/events en server.js
module.exports = router;
