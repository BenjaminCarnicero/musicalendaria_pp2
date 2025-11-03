// routes.js — Define los endpoints HTTP para la entidad "artist".
// Usa el controlador para la lógica y el helper response.js para las respuestas uniformes.

const express = require('express');
const response = require('../../network/responses'); // Helper que da formato {error, status, body}
const controller = require('./controller'); // Lógica de negocio del artista

const router = express.Router(); // Creamos un router de Express

// --- Endpoints disponibles ---
// GET    /api/artists/          -> listar todos los artistas
// GET    /api/artists/:id       -> obtener un artista por ID
// POST   /api/artists/          -> crear un nuevo artista
// DELETE /api/artists/          -> eliminar un artista (por body.id)
// PUT    /api/artists/:id       -> actualizar un artista existente

router.get('/', listArtists);
router.get('/:id', getArtist);
router.post('/', createArtist);
router.delete('/', removeArtist);
router.put('/:id', updateArtist);

// --- Funciones manejadoras (controllers de las rutas) ---

async function listArtists(req, res, next) {
    try {
        // Llama al controlador para obtener todos los artistas
        const artists = await controller.getAllArtists();
        response.success(req, res, artists, 200);
    } catch (err) {
        next(err);
    }
}

async function getArtist(req, res, next) {
    try {
        // Busca el artista por el ID que viene en la URL (req.params.id)
        const artist = await controller.getArtistById(req.params.id);
        response.success(req, res, artist, 200);
    } catch (err) {
        next(err);
    }
}

async function createArtist(req, res, next) {
    try {
        // Crea un nuevo artista con los datos recibidos en el body (req.body)
        const artist = await controller.addArtist(req.body);
        response.success(req, res, artist, 201);
    } catch (err) {
        next(err);
    }
}

async function removeArtist(req, res, next) {
    try {
        // Elimina el artista cuyo ID se envía en el body
        const result = await controller.deleteArtist(req.body);
        response.success(req, res, result, 200);
    } catch (err) {
        next(err);
    }
}

async function updateArtist(req, res, next) {
    try {
        // Actualiza el artista con el ID que viene por parámetro y los datos del body
        const updated = await controller.updateArtist(req.params.id, req.body);
        response.success(req, res, updated, 200);
    } catch (err) {
        next(err);
    }
}

// Exportamos el router para que sea montado en /api/artists en server.js
module.exports = router;
