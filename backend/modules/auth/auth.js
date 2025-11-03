// routes.js — Define los endpoints HTTP de autenticación (login y registro).
// Usa el controlador y un helper response para respuestas uniformes.

const express = require('express');
const router = express.Router();
const auth = require('./controller');
const response = require('../../network/responses');

// --- RUTAS DISPONIBLES ---
// POST /api/auth/login     -> iniciar sesión
// POST /api/auth/register  -> registrar nuevo artista

router.post('/login', async (req, res, next) => {
    try {
        const { usuario, password } = req.body;
        const result = await auth.login(usuario, password);
        response.success(req, res, result, 200);
    } catch (err) {
        next(err);
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const result = await auth.register(req.body);
        response.success(req, res, result.message, 201);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
